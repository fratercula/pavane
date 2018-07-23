#!/usr/bin/env node

const { join } = require('path')
const minimist = require('minimist')
const Server = require('../')

const server = new Server()
const { p, c } = minimist(process.argv.slice(2))
const port = Number(p)

if (c) {
  const config = c === true ? 'pavane.config.js' : c

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    server.listener = require(join(process.cwd(), config))
  } catch ({ message }) {
    global.console.log(message)
  }
}

server.start(port || undefined)
