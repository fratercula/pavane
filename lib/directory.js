const { readFileSync } = require('fs')
const { join, extname } = require('path')
const { isFile } = require('./util')

const ignores = [
  '.DS_Store',
  'Thumbs.db',
  'Desktop.ini',
  'desktop.ini',
  '$RECYCLE.BIN',
  '.Trashes',
]
const html = readFileSync(join(__dirname, 'directory.html'), 'utf8')

module.exports = function directory(items, path, publics) {
  const $path = path.split(join(publics, '/'))[1].slice(0, -1)

  let dirs = []
  let files = []

  items.forEach((item) => {
    if (ignores.includes(item)) {
      return
    }
    if (isFile(join(path, item))) {
      files.push(item)
      return
    }
    dirs.push(item)
  })

  dirs = dirs.map(dir => `<p><a href="${dir}/">${dir}/</a></p>`)

  if ($path) {
    const parent = $path.includes('/') ? `/${$path.split('/')[0]}` : ''
    dirs.unshift(`<p><a href="${parent}/">../</a></p>`)
  }

  files = files
    .sort((a, b) => extname(a) > extname(b))
    .map(file => `<p><a href="${file}">${file}</a></p>`)

  const $links = dirs.join('\n') + files.join('\n')

  const file = html
    .replace('$links', $links)
    .replace(/\$path/g, `/${$path}`)

  this.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    Expires: '-1',
    Pragma: 'no-cache',
  })
  this.write(file)
  this.end()
}
