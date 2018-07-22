const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')
const page404 = require('./404')
const page200 = require('./200')
const page500 = require('./500')
const directory = require('./directory')

function isFile(filePath) {
  return fs.statSync(filePath).isFile()
}

function isDirectory(filePath) {
  return fs.statSync(filePath).isDirectory()
}

module.exports = class {
  constructor(publics) {
    this.publics = publics
  }

  reqPath(req) {
    const { pathname } = url.parse(req.url)
    return decodeURIComponent(path.join(this.publics, pathname))
  }

  create(port = 2333) {
    return http.createServer((req, res) => {
      try {
        const filePath = this.reqPath(req)

        if (isFile(filePath)) {
          page200(res, filePath)
          return
        }

        if (!isDirectory(filePath)) {
          page404(res)
          return
        }

        const index = path.join(filePath, 'index.html')

        if (isFile(index)) {
          page200(res, index)
          return
        }

        const files = fs.readdirSync(filePath)

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
