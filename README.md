# Pavane

[![Build Status](https://travis-ci.org/fratercula/pavane.svg?branch=master)](https://travis-ci.org/fratercula/pavane)
[![codecov](https://codecov.io/gh/fratercula/pavane/branch/master/graph/badge.svg)](https://codecov.io/gh/fratercula/pavane)

LiveReload Server

[中文文档](README.zh-CN.md)

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
  server static files path
  default: process.cwd()
*/
const publics = __dirname

const server = new Pavane(watches, publics)

server.listener = (args) => {
  const {
    event,        // 'add', 'change', 'info' ...
    path,         // file path
    message,      // server message
    reloadCss,    // trigger client reload css
    reloadPage,   // trigger client reload page
  } = args
  const { log } = global.console

  if (event === 'info') {
    log(message)  // log server message
    return
  }

  const ext = extname(path)

  if (ext === '.css') {
    reloadCss()   // reload css
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

### CLI

#### default

```bash
$ pavane

# or
$ pv
```

#### custom server port

```bash
$ pavane -p 2000

# or
$ pv -p 2222
```

#### custom path

```bash
# watch `src`, and set `dist` server path
$ pavane -w src -s dist

# or
$ pv -w src -s dist
```

#### use config

setup `pavane.config.js`

```js
const { extname } = require('path')

module.exports = {
  watches: ['*.js', '*.css', '*.html', '**/*.html'],
  publics: __dirname,
  port: 2222, // server port
  listener(args) {
    const {
      event,
      path,
      message,
      reloadCss,
      reloadPage,
    } = args
    const { log } = global.console

    if (event === 'info') {
      log(message)
      return
    }

    const ext = extname(path)

    if (ext === '.css') {
      reloadCss()
    } else {
      reloadPage()
    }

    log(`${event} ${path}`)
  }
}
```

```bash
# start width config
$ pavane -c

# or
$ pv -c
```

### Use on other server

if your web application base on other server (python server, php server ...), add this `script` in your html template

```html
<!-- if the server port is 2333 -->
<script src="http://127.0.0.1:2333/_.js"></script>
```

## Development

```bash
$ npm start
```

#### lint

```bash
$ npm run test:lint
```

#### test

```bash
$ npm t
```

#### cli dev

```bash
# port
$ cd test && node ../bin/index.js -p 2000

# config
$ cd test && node ../bin/index.js -c
```

## License

MIT
