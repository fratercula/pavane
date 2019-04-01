const { readFileSync } = require('fs')
const { join } = require('path')
const mime = require('mime')

module.exports = (res, filePath) => {
  const file = readFileSync(filePath)
  const type = mime.getType(filePath)
  const inject = readFileSync(join(__dirname, 'inject.js'))

  res.writeHead(200, {
    'Content-Type': type || 'text/plain',
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    Expires: '-1',
    Pragma: 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'X-Data-Type,X-Auth-Token,Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,X-Data-Type,X-Requested-With,content-type,token',
  })

  res.write(file)

  if (type === 'text/html') {
    res.write(`<script>${inject}</script>`)
  }

  res.end()
}
