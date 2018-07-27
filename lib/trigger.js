const { extname } = require('path')

module.exports = (args) => {
  const {
    event,
    path,
    message,
    reloadCss,
    reloadPage,
  } = args
  const { log } = global.console

  if (event === 'info') {
    log(message)
    return
  }

  const ext = extname(path)

  if (ext === '.css') {
    reloadCss()
  } else {
    reloadPage()
  }

  log(`${event} ${path}`)
}
