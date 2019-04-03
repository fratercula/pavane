const { readFileSync, statSync } = require('fs')
const { join, extname } = require('path')
const mime = require('mime')
const { version } = require('../package.json')
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
    const filePath = join(path, item)
    if (ignores.includes(item)) {
      return
    }
    if (isFile(filePath)) {
      const { size, mtimeMs } = statSync(filePath)
      const type = mime.getType(filePath) || 'text/plain'
      files.push({
        name: item,
        size,
        time: new Date(mtimeMs).toLocaleString(),
        type,
      })
      return
    }
    dirs.push(item)
  })

  dirs = dirs.map(dir => `<p><a href="${dir}/">${dir}/</a></p>`)

  if ($path) {
    const parent = $path.includes('/') ? `/${$path.split('/').slice(0, -1).join('/')}` : ''
    dirs.unshift(`<p><a href="${parent}/">../</a></p>`)
  }

  files = files
    .sort((a, b) => extname(a.name) > extname(b.name))
    .map(file => `
      <p>
        <a href="${file.name}">${file.name}</a>
        <span class="size">${file.size}</span>
        <span class="time">${file.time}</span>
        <span class="type">${file.type}</span>
      </p>
    `)

  const $links = dirs.join('\n') + files.join('\n')

  const file = html
    .replace('$links', $links)
    .replace(/\$path/g, `/${$path}`)
    .replace('$version', version)

  this.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    Expires: '-1',
    Pragma: 'no-cache',
  })
  this.write(file)
  this.end()
}
