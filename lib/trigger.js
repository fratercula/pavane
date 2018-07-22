const { extname } = require('path')

module.exports = (args) => {
  const {
    event,
    filePath,
    message = '',
    clients = [],
  } = args
  const { log } = global.console

  if (event === 'message') {
    log(message)
    return
  }

  const ext = extname(filePath)
  const msg = ext === '.css' ? 'css' : 'reload'

  clients.forEach(client => client.send(msg))
  log(`${event} ${filePath}`)
}
