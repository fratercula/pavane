const { extname } = require('path')

const { log } = global.console

module.exports = {
  watches: ['*.js', '*.css', '*.html', '**/*.html'],
  publics: __dirname,
  port: 2222,
  listener(args) {
    const {
      event,
      path,
      port,
      clients,
      trigger,
      status,
    } = args

    if (status === 'start') {
      log(`Server running: http://127.0.0.1:${port}\n  CTRL + C to shutdown`)
      return
    }

    if (status === 'running') {
      log('Server is already running...')
      return
    }

    if (event) {
      if (extname(path) === '.css') {
        trigger('css')
      } else {
        trigger('page')
      }
      log(`${event}: ${path}`)
      return
    }

    log(`clients: ${clients}`)
  },
}
