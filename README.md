# Pavane

[![Build Status](https://travis-ci.org/fratercula/pavane.svg?branch=master)](https://travis-ci.org/fratercula/pavane)
[![codecov](https://codecov.io/gh/fratercula/pavane/branch/master/graph/badge.svg)](https://codecov.io/gh/fratercula/pavane)

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
