#!/usr/bin/env node

const { join } = require('path')
const minimist = require('minimist')
const Server = require('../')

const { p, c } = minimist(process.argv.slice(2))

let server = new Server()
let port = p === true ? undefined : Number(p)

if (c) {
  try {
    const {
      watches,
      publics,
      port: pt,
      listener,
    // eslint-disable-next-line global-require, import/no-dynamic-require
    } = require(join(process.cwd(), 'pavane.config.js'))

    server = new Server(watches, publics)
    port = Number(pt)
    if (listener) {
      server.listener = listener
    }
  } catch ({ message }) {
    global.console.log(message)
  }
}

server.start(port || undefined)
