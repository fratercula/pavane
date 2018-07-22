module.exports = (res) => {
  res.writeHead(500, { 'Content-Type': 'text/plain' })
  res.write('Internal Server Error')
  res.end()
}
