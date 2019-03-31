const { readFileSync } = require('fs')
const { join } = require('path')
const mime = require('mime')

module.exports = (res, filePath) => {
  const file = readFileSync(filePath)
  const type = mime.getType(filePath)
  const inject = readFileSync(join(__dirname, 'inject.js'))

  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    Expires: '-1',
    Pragma: 'no-cache',
    'Access-Control-Allow-Origin': '*',
  })

  res.write(file)

  if (type === 'text/html') {
    res.write(`<script>${inject}</script>`)
  }

  res.end()
}
