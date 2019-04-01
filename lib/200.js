const { createReadStream } = require('fs')
const mime = require('mime')

module.exports = (req, res, filePath) => {
  const type = mime.getType(filePath)
  const stream = createReadStream(filePath)

  let inject = false

  res.writeHead(200, {
    'Content-Type': type || 'text/plain',
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    Expires: '-1',
    Pragma: 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': req.method,
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': Object.keys(req.headers).join(),
  })

  stream.on('data', (data) => {
    if (type === 'text/html') {
      let current = data.toString()

      if (current.includes('</head>')) {
        current = current.replace('</head>', '<script src="/_.js"></script>\n</head>')
        inject = true
      }

      res.write(current)
    } else {
      inject = true
      res.write(data)
    }
  })

  stream.on('end', () => {
    if (!inject) {
      res.write('<script src="/_.js"></script>')
    }
    inject = false
    res.end()
  })
}
