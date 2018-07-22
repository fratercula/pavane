const { readFileSync } = require('fs')
const { join } = require('path')

const ignores = [
  '.DS_Store',
  'Thumbs.db',
]

module.exports = (res, files) => {
  const html = readFileSync(join(__dirname, 'directory.html'), 'utf8')
  const links = files
    .filter(file => ignores.indexOf(file) === -1)
    .map(file => `<a href="${file}">${file}</a>`)
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
