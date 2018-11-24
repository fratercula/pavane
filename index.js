const chokidar = require('chokidar')
const { Server } = require('ws')
const StaticServer = require('./lib/server')
const trigger = require('./lib/trigger')
const defaultParams = require('./lib/params')

module.exports = class extends StaticServer {
  constructor(watches = process.cwd(), publics) {
    super(publics)
    this.watches = watches
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

  set listener(fn) {
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
    this.trigger({
      ...defaultParams,
      event: 'info',
      message: `clients: ${this.clients.length}`,
    })
  }

  start(port = 2333) {
    if (this.server) {
      this.trigger({
        ...defaultParams,
        event: 'info',
        message: 'The server is running...',
      })
      return
    }

    this.server = this.create(port)

    this.watcher = chokidar.watch(this.watches, {
      ignored: /(^|[/\\])\../,
      ignoreInitial: true,
    })

    this.watcher.on('all', (event, filePath) => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.current = { event, path: filePath }
        this.trigger({
          event,
          path: filePath,
          message: '',
          reloadCss: () => {
            this.clients.forEach(client => client.send('css'))
          },
          reloadPage: () => {
            this.clients.forEach(client => client.send('reload'))
          },
        })
      }, 100)
    })

    this.ws = new Server({ server: this.server })
    this.ws.on('connection', (client) => {
      client.on('close', () => this.removeClient(client))
      client.on('error', () => this.removeClient(client))
      this.clients.push(client)
      this.trigger({
        ...defaultParams,
        event: 'info',
        message: `clients: ${this.clients.length}`,
      })
    })

    this.trigger({
      ...defaultParams,
      event: 'info',
      message: `Server running: http://127.0.0.1:${port}\n  CTRL + C to shutdown`,
    })
  }
}
