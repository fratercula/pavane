const { readFileSync } = require('fs')
const { join } = require('path')
const { isFile } = require('./util')

const ignores = [
  '.DS_Store',
  'Thumbs.db',
]

module.exports = (res, files, path) => {
  const html = readFileSync(join(__dirname, 'directory.html'), 'utf8')
  const links = files
    .filter(file => ignores.indexOf(file) === -1)
    .map((file) => {
      const filePath = join(path, file)
      const href = isFile(filePath) ? file : `${file}/`
      return `<a href="${href}">${file}</a>`
    })
    .join('')
  const file = html.replace('$links', links)

  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    Expires: '-1',
    Pragma: 'no-cache',
  })
  res.write(file)
  res.end()
}
