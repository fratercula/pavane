module.exports = (args) => {
  const {
    message,
    event,
    filePath,
    clients,
  } = args
  console.log(message)
  console.log(event)
}
