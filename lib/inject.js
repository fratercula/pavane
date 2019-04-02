class Pavane {
  constructor() {
    this.$subscribe = null
  }

  set subscribe(fn) {
    if (typeof fn === 'function') {
      this.$subscribe = fn
    }
  }

  get subscribe() {
    return this.$subscribe
  }
}

const pavane = new Pavane()
const socketScript = Array.from(document.scripts).find(script => script.src.includes('/_.js'))
const { host } = new URL(socketScript.src)

let times = 0
let ws = null

function socket() {
  ws = new WebSocket(`ws://${host}`)

  ws.onmessage = ({ data }) => {
    const { subscribe } = pavane

    if (subscribe) {
      subscribe(data)
      return
    }

    window.console.info(data)

    if (data === 'page') {
      window.location.reload()
      return
    }

    if (data === 'css') {
      const sheets = Array.from(document.getElementsByTagName('link'))
      const [head] = document.getElementsByTagName('head')

      for (let i = 0; i < sheets.length; i += 1) {
        const elem = sheets[i]
        const { rel, href } = elem

        if (rel === 'stylesheet') {
          const link = document.createElement('link')
          const newHref = href.split('?')[0]

          link.rel = 'stylesheet'
          link.href = `${newHref}?_=${+new Date()}`
          link.onload = () => head.removeChild(elem)

          head.appendChild(link)
        }
      }
    }
  }

  ws.onopen = () => window.console.info('socket connected')

  ws.onclose = () => {
    ws = null

    if (times <= 10) {
      times += 1
      window.console.error('socket closed, reconnecting...')
      setTimeout(socket, 5000)
    } else {
      window.console.info('socket connect failed, please refresh the browser')
    }
  }
}

if (!window.__PAVANE__) { // eslint-disable-line no-underscore-dangle
  socket()
  window.__PAVANE__ = pavane // eslint-disable-line no-underscore-dangle
}
