#!/usr/bin/env node

const { join } = require('path')
const minimist = require('minimist')
const Server = require('../')

const {
  p,
  c,
  w,
  s,
} = minimist(process.argv.slice(2))
const cwd = process.cwd()

let port = p === true ? undefined : Number(p)
let watches = w || true
let publics = s || true

watches = watches === true ? undefined : join(cwd, watches)
publics = publics === true ? undefined : join(cwd, publics)

let server = new Server(watches, publics)

if (c) {
  try {
    const {
      watches: ws,
      publics: ps,
      port: pt,
      subscribe,
    // eslint-disable-next-line global-require, import/no-dynamic-require
    } = require(join(cwd, 'pavane.config.js'))

    watches = ws || watches
    publics = ps || publics

    server = new Server(watches, publics)
    port = Number(pt)
    if (subscribe) {
      server.subscribe = subscribe
    }
  } catch ({ message }) {
    global.console.log(message)
  }
}

server.start(port || undefined)
