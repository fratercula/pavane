const { statSync, existsSync } = require('fs')
const { join } = require('path')
const { parse } = require('url')

module.exports.isFile = filePath => statSync(filePath).isFile()

module.exports.exists = filePath => existsSync(filePath)

module.exports.urlParse = (main, { url }) => {
  const { pathname } = parse(url)
  return decodeURIComponent(join(main, pathname))
}
