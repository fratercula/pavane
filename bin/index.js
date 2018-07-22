#!/usr/bin/env node

const { join } = require('path')
const minimist = require('minimist')
const Server = require('../')

const server = new Server()
const { p, c } = minimist(process.argv.slice(2))

if (c) {
  const config = c === true ? 'pavane.config.js' : c

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    server.trigger = require(join(process.cwd(), config))
  } catch ({ message }) {
    global.console.log(message)
  }
}

server.start(p)
