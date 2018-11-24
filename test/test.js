/* global describe it */

const { writeFileSync, mkdirSync, rmdirSync } = require('fs')
const { join } = require('path')
const http = require('http')
const puppeteer = require('puppeteer-cn')
const assert = require('power-assert')
const sinon = require('sinon')
const Server = require('../')

function sleep(t = 1000) {
  return new Promise(resolve => setTimeout(resolve, t))
}

function request(path = '/') {
  return new Promise(resolve => http.get({
    host: '127.0.0.1',
    port: '2333',
    path,
  }, (res) => {
    resolve(res.statusCode)
  }))
}

describe('pavane', () => {
  it('static server', async () => {
    const spy = sinon.spy(global.console, 'log')
    const server = new Server(__dirname, __dirname)
    const emptyPath = join(__dirname, 'empty')

    server.listener = 'not a function'
    server.start()

    server.trigger({ event: 'info', message: 'not a function' })
    assert(spy.calledWith('not a function') === true)

    server.start()
    assert(spy.calledWith('The server is running...') === true)

    mkdirSync(emptyPath)
    let code = await request('/empty')
    assert(code === 404)
    server.close()
    rmdirSync(emptyPath)

    server.start()
    code = await request('/noexist')
    assert(code === 404)
    server.close()

    server.start()
    code = await request('/dir')
    assert(code === 200)
    server.close()

    server.start()
    code = await request('/index.js')
    assert(code === 200)
    server.close()

    server.start()
    code = await request('/_.js')
    assert(code === 200)
    server.close()

    server.start()
    code = await request()
    assert(code === 200)

    server.close()
    assert(server.status.running === false)
  })

  it('liveReload', async function liveReload() {
    this.timeout(10000)

    const msgs = []
    const server = new Server(__dirname, __dirname)

    server.start()

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1:2333/dir')
    page.on('console', e => msgs.push(e.text()))

    await sleep()
    writeFileSync(join(__dirname, 'home.html'), '<h1>Pavane</h1>')
    await sleep()

    assert(server.status.event === 'change')
    assert(server.status.path === join(__dirname, 'home.html'))
    assert(msgs.length === 4)

    writeFileSync(join(__dirname, 'index.css'), 'body { background: #eee }')
    await sleep()

    assert(server.status.event === 'change')
    assert(server.status.path === join(__dirname, 'index.css'))
    assert(msgs[4] === 'css')

    await browser.close()
    server.close()

    server.listener = args => msgs.push(args.event)
    server.start()

    assert(msgs[5] === 'info')

    server.close()
  })
})
