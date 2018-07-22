module.exports = (res) => {
  res.writeHead(404, { 'Content-Type': 'text/html' })
  res.write('<h2>404 Not Found</h2>')
  res.end()
}
