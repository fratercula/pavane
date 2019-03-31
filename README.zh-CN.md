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

#### 自定义路径

```bash
# 监听 `src` 目录, 设置 `dist` 目录为 server 静态目录
$ pavane -w src -s dist

# or
$ pv -w src -s dist
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

### 在其他服务器上使用

如果你的 web 应用是 python，php 或者其他产生的 web 服务，可以添加下面的 script 到你的应用 html 模板上

```html
<!-- 假设当前启动的服务端口是 2333 -->
<script src="http://127.0.0.1:2333/_.js"></script>
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
