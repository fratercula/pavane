const { readFileSync } = require('fs')
const { join } = require('path')
const mime = require('mime')

function inject(filePath) {
  if (mime.getType(filePath) !== 'text/html') {
    return ''
  }
  return readFileSync(join(__dirname, 'inject.html'))
}

module.exports = (res, filePath) => {
  const file = readFileSync(filePath)

  res.writeHead(200, {
    'Content-Type': mime.getType(filePath),
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    Expires: '-1',
    Pragma: 'no-cache',
    'Access-Control-Allow-Origin': '*',
  })
  res.write(file)
  res.write(inject(filePath))
  res.end()
}
