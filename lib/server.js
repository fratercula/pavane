const { createServer } = require('http')
const { join } = require('path')
const { readdirSync } = require('fs')
const { isFile, exists, urlParse } = require('./util')
const page404 = require('./404')
const page200 = require('./200')
const page500 = require('./500')
const directory = require('./directory')

module.exports = class {
  constructor(publics = process.cwd()) {
    this.publics = publics
  }

  create(port) {
    return createServer((req, res) => {
      try {
        const filePath = urlParse(this.publics, req)
        const { url } = req

        if (url === '/_.js') {
          page200(res, join(__dirname, 'inject.js'))
          return
        }

        if (!exists(filePath)) {
          page404(res)
          return
        }

        if (isFile(filePath)) {
          page200(res, filePath)
          return
        }

        const index = join(filePath, 'index.html')

        if (exists(index)) {
          page200(res, index)
          return
        }

        const files = readdirSync(filePath)

        if (!files.length) {
          page404(res)
          return
        }

        directory(res, files)
      } catch (e) {
        page500(res)
      }
    }).listen(port)
  }
}
