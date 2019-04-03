# Pavane

LiveReload Server

## 安装

```bash
$ npm i pavane -D

# 全局
$ npm i pavane -g
```

## 使用

服务端

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

server.subscribe = (args) => {
  const {
    event,        // 监听文件变化事件
    path,         // 监听文件变化路径
    port,         // server 初始化端口
    clients,      // 客户端数量
    status,       // 当前状态 `stop`, `start`, `running`
    trigger,      // 触发事件函数，`css` 为重新加载样式，`page` 为刷新页面，可以设定其他状态
  } = args
  const { log } = global.console

  if (status === 'start') {
    log(`Server running: http://127.0.0.1:${port}\n  CTRL + C to shutdown`)
    return
  }

  if (status === 'running') {
    log('Server is already running...')
    return
  }

  if (event) {
    if (...) {
      trigger('custom message') // 自定义
      return
    }

    if (extname(path) === '.css') {
      trigger('css') // 重新加载样式
    } else {
      trigger('page') // 刷新页面
    }
    log(`${event}: ${path}`)
    return
  }

  log(`clients: ${clients}`) // 当前客户端数量
}

server.start(2222) // 默认端口 2333

server.close() // 关闭
```

客户端

```js
// 默认情况下，浏览器会监听服务器信息并自动刷新 style 或者 page
// 你可以自定义监听函数
// 设置以下 script 在 `<head></head>` 标签后面

window.__PAVANE__.subscribe = (data) => {
  console.log(data) // 服务端信息
  // ...
}
```

## CLI

**默认**

```bash
$ pavane

# 或者
$ pv
```

**端口**

```bash
$ pavane -p 2000

# 或者
$ pv -p 2222
```

**自定义路径**

```bash
# 监听 `src` 目录, 设置 `dist` 目录为 server 静态目录
$ pavane -w src -s dist

# or
$ pv -w src -s dist
```

**使用配置文件**

新建 `pavane.config.js`

```js
const { extname } = require('path')

module.exports = {
  watches: ['*.js', '*.css', '*.html', '**/*.html'],
  publics: __dirname,
  port: 2222, // 端口
  subscribe(args) {
    // ...
  },
}
```

使用配置启动

```bash
# 使用配置启动
$ pavane -c

# 或者
$ pv -c
```

## 其他服务器上使用

如果你的 web 应用是 python，php 或者其他产生的 web 服务，可以添加下面的 script 到你的应用 html 模板上

```html
<!-- 假设当前启动的服务端口是 2333 -->
<script src="http://127.0.0.1:2333/_.js"></script>
```

## 开发

```bash
# server
$ npm start

# lint
$ npm run test:lint

# unit test
$ npm run test:unit

# coverage test
$ npm run test:unit

# cli
# port
$ cd test && node ../bin/index.js -p 2000

# config
$ cd test && node ../bin/index.js -c
```

## License

MIT
