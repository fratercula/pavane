const chokidar = require('chokidar')
const { Server } = require('ws')
const StaticServer = require('./lib/server')
const defaultSubscribe = require('./lib/subscribe')
const defaultParams = require('./lib/params')

module.exports = class extends StaticServer {
  constructor(watches = process.cwd(), publics) {
    super(publics)
    this.watches = watches
    this.initialize()
  }

  initialize() {
    this.timer = null
    this.server = null
    this.ws = null
    this.watcher = null
    this.clients = []
    this.$subscribe = defaultSubscribe
  }

  set subscribe($subscribe) {
    if (typeof $subscribe === 'function') {
      this.$subscribe = $subscribe
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
    this.$subscribe({ ...defaultParams, clients: this.clients.length })
  }

  start(port = 2333) {
    if (this.server) {
      this.$subscribe({ ...defaultParams, status: 'running' })
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
        this.$subscribe({
          ...defaultParams,
          event,
          path: filePath,
          trigger: type => this.clients.forEach(client => client.send(type)),
        })
      }, 100)
    })

    this.ws = new Server({ server: this.server })
    this.ws.on('connection', (client) => {
      client.on('close', () => this.removeClient(client))
      client.on('error', () => this.removeClient(client))
      this.clients.push(client)
      this.$subscribe({ ...defaultParams, clients: this.clients.length })
    })

    this.trigger({ ...defaultParams, port, status: 'start' })
  }
}
