module.exports = (res) => {
  res.writeHead(500, { 'Content-Type': 'text/html' })
  res.write('<h2>Internal Server Error</h2>')
  res.end()
}
