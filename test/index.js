const { writeFileSync, mkdirSync, rmdirSync } = require('fs')
const { join } = require('path')
const http = require('http')
const puppeteer = require('puppeteer')
const assert = require('power-assert')
const Server = require('../')
const defaultSubscribe = require('../lib/subscribe')

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
    const dir = join(__dirname, 'fixtures')
    const server = new Server(dir, dir)

    // subscribe
    server.subscribe = 'not a function'
    assert(server.$subscribe === defaultSubscribe)

    // restart
    let subData
    server.subscribe = (data) => { subData = data }

    server.start()
    assert(subData.status === 'start')
    server.start()
    assert(subData.status === 'running')

    // request
    const emptyPath = join(dir, 'empty')
    mkdirSync(emptyPath)
    let code = await request('/empty')
    assert(code === 404)
    rmdirSync(emptyPath)

    code = await request('/noexist')
    assert(code === 404)

    code = await request('/dir')
    assert(code === 200)

    code = await request('/console.js')
    assert(code === 200)

    code = await request('/_.js')
    assert(code === 200)

    code = await request()
    assert(code === 200)

    server.close()
  })

  /*
  it('liveReload', async () => {
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
  */
})
