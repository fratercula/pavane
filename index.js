const { watch } = require('chokidar')
const { Server } = require('ws')
const StaticServer = require('./lib/server')
const trigger = require('./lib/trigger')

module.exports = class extends StaticServer {
  constructor(watchs = process.cwd(), publics) {
    super(publics)
    this.watchs = watchs
    this.initialize()
  }

  initialize() {
    this.timer = null
    this.clients = []
    this.server = null
    this.ws = null
    this.watcher = null
    this.current = {}
    this.trigger = trigger
  }

  set onChange(fn) {
    if (typeof fn === 'function') {
      this.trigger = fn
    }
  }

  get status() {
    return {
      ...this.current,
      running: !!this.server,
    }
  }

  close() {
    this.watcher.close()
    this.ws.close()
    this.server.close()
    this.initialize()
  }

  removeClient(client) {
    this.clients = this.clients.filter(c => c !== client)
  }

  start(port = 2333) {
    if (this.server) {
      this.trigger({
        event: 'message',
        message: 'The server is running...',
      })
      return
    }

    this.watcher = watch(this.watches, {
      ignored: /(^|[/\\])\../,
      ignoreInitial: true,
    })
    this.watcher.on('all', (event, filePath) => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.current = { event, filePath }
        this.trigger({
          event,
          filePath,
          clients: this.clients,
        })
      })
    })

    this.server = this.create(port)

    this.ws = new Server({ server: this.server })
    this.ws.on('connection', (client) => {
      client.on('close', () => this.removeClient(client))
      client.on('error', () => this.removeClient(client))
      this.clients.push(client)
    })

    this.trigger({
      event: 'message',
      message: `Server running: http://127.0.0.1:${port}/\n  CTRL + C to shutdown`,
    })
  }
}
