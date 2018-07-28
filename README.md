# Pavane

LiveReload Server

## Install

```bash
$ npm i pavane -D

# cli
$ npm i pavane -g
```

## Usage

```js
const { join, extname } = require('path')
const Pavane = require('pavane')

/*
  watch path
  file, dir, glob, or array
  default: process.cwd()
*/
const watches = join(process.cwd(), 'src')

/*
  server path
  default: process.cwd()
*/
const publics = __dirname

const server = new Pavane(watches, publics)

server.listener = (args) => {
  const {
    event,        // 'add', 'change', 'info' ...
    path,         // file path or empty when event is 'info'
    message,      // empty or server message when event is 'info'
    reloadCss,    // reload client css method
    reloadPage,   // reload client method
  } = args
  const { log } = global.console

  if (event === 'info') {
    log(message)  // log server message
    return
  }

  const ext = extname(path)

  if (ext === '.css') {
    reloadCss()   // reload client css
  } else {
    reloadPage()  // reload page
  }

  log(`${event} ${path}`) // log current message
}

server.start(2222) // default 2333

// get server status
console.log(server.status)
/*
{
  running: true,
  event: 'change',
  path: 'file path',
}
*/
```
