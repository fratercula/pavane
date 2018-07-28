# Pavane

LiveReload Server

## 安装

```bash
$ npm i pavane -D

# 全局
$ npm i pavane -g
```

## 使用

```js
const { join, extname } = require('path')
const Pavane = require('pavane')

/*
  监听目录
  文件, 目录, glob 匹配, 或者 数组
  默认: 当前运行目录
*/
const watches = join(process.cwd(), 'src')

/*
  静态资源目录
  默认: 当前运行目录
*/
const publics = __dirname

const server = new Pavane(watches, publics)

server.listener = (args) => {
  const {
    event,        // 文件信息 'add', 'change', 或者服务器信息 'info' ...
    path,         // 修改路径，当事件为 'info', 为空
    message,      // 服务器信息，如果事件为 'info', 此时为空
    reloadCss,    // 触发客户端 css 重置
    reloadPage,   // 触发客户端刷新页面
  } = args
  const { log } = global.console

  if (event === 'info') {
    log(message)  // 输出服务器信息
    return
  }

  const ext = extname(path)

  if (ext === '.css') {
    reloadCss()   // 重置 css
  } else {
    reloadPage()  // 刷新页面
  }

  log(`${event} ${path}`) // 输出当前信息
}

server.start(2222) // 默认端口 2333

// 获取当前服务器状态
console.log(server.status)
/*
{
  running: true,
  event: 'change',
  path: 'file path',
}
*/
```

### CLI 使用

#### 默认

```bash
$ pavane

# 或者
$ pv
```

#### 自定义端口

```bash
$ pavane -p 2000

# 或者
$ pv -p 2222
```

#### 使用配置文件

新建 `pavane.config.js`

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
# 使用配置启动
$ pavane -c

# 或者
$ pv -c
```

## 开发

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
# 端口调试
$ cd test && node ../bin/index.js -p 2000

# 配置调试
$ cd test && node ../bin/index.js -c
```

## License

MIT
