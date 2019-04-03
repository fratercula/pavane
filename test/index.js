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

const dir = join(__dirname, 'fixtures')

describe('pavane', () => {
  it('default params', async () => {
    const server = new Server()
    assert(server.watches === process.cwd())
    assert(server.publics === process.cwd())

    server.start()
    assert(await request() === 200)

    server.start()
    assert(await request() === 200)

    server.close()
  })

  it('static server', async () => {
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

  it('liveReload', async () => {
    const server = new Server(dir, dir)

    const logs = []

    server.start()

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1:2333/dir')
    page.on('console', e => logs.push(e.text()))

    await sleep()
    writeFileSync(join(dir, 'dir', 'index.css'), 'h1 { color: blanchedalmond }')
    await sleep()
    writeFileSync(join(dir, 'pavane.html'), '<h1>Pavane</h1>')
    await sleep()

    assert(logs.includes('css') === true)
    assert(logs.includes('page') === true)

    await browser.close()
    server.close()
  })
})
