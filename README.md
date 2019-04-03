# Pavane

[![Build Status](https://travis-ci.org/fratercula/pavane.svg?branch=master)](https://travis-ci.org/fratercula/pavane)
[![codecov](https://codecov.io/gh/fratercula/pavane/branch/master/graph/badge.svg)](https://codecov.io/gh/fratercula/pavane)

LiveReload Server

[中文文档](README.zh-CN.md)

## Install

```bash
$ npm i pavane -D

# CLI
$ npm i pavane -g
```

## Usage

server

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
  server static files path
  default: process.cwd()
*/
const publics = __dirname

const server = new Pavane(watches, publics)

// add subscribe
server.subscribe = (args) => {
  const {
    event,        // watch files change event
    path,         // changed file path
    port,         // server port
    clients,      // current clients number
    status,       // server status, `stop`, `start`, `running`
    trigger,      // trigger clients reload `css` or `page`
  } = args
  const { log } = global.console

  if (status === 'start') {
    log(`Server running: http://127.0.0.1:${port}\n  CTRL + C to shutdown`)
    return
  }

  if (status === 'running') {
    log('Server is already running...')
    return
  }

  if (event) {
    if (...) {
      trigger('custom message') // custom
      return
    }

    if (extname(path) === '.css') {
      trigger('css') // reload style
    } else {
      trigger('page') // reload page
    }
    log(`${event}: ${path}`)
    return
  }

  log(`clients: ${clients}`) // current clients number
}

server.start(2222) // default 2333

server.close() // close server
```

client

```js
// by default, browser subscribes for server socket messafes and automatically refreshes `style` or `page`
// but you can custom subscribes
// set scripts after `<head></head>` tag

window.__PAVANE__.subscribe = (data) => {
  console.log(data) // server socket message
  // do other things
}
```

## CLI

**default**

```bash
$ pavane

# or
$ pv
```

**server port**

```bash
$ pavane -p 2000

# or
$ pv -p 2222
```

**custom path**

```bash
# watch `src`, and set `dist` server path
$ pavane -w src -s dist

# or
$ pv -w src -s dist
```

**use config**

setup `pavane.config.js`

```js
const { extname } = require('path')

module.exports = {
  watches: ['*.js', '*.css', '*.html', '**/*.html'],
  publics: __dirname,
  port: 2222, // server port
  subscribe(args) {
    // ...
  },
}
```

start width config

```bash
# start width config
$ pavane -c

# or
$ pv -c
```

## Use on other server

if your web application run on other server (python server, php server ...), add this `script` in main template

```html
<!-- if the server port is 2333 -->
<script src="http://127.0.0.1:2333/_.js"></script>
```

## Development

```bash
# server
$ npm start

# lint
$ npm run test:lint

# unit test
$ npm run test:unit

# coverage test
$ npm run test:unit

# cli
# port
$ cd test && node ../bin/index.js -p 2000

# config
$ cd test && node ../bin/index.js -c
```

## License

MIT
