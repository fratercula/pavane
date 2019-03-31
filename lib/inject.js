/* eslint-disable */
(function() {
  var times = 0
  function socket() {
    var host = location.host
    var scripts = [].slice.call(document.scripts).filter(function(script) {
      return script.src.indexOf('/_.js') > -1
    })
    if (scripts.length) {
      host = scripts[0].src.split('/_.js')[0].split('http://')[1]
    }
    var ws = new WebSocket('ws://'+ host)
    ws.onmessage = function(e) {
      e = e.data
      console.log(e)
      if (e === 'page') {
        location.reload()
      }
      if (e === 'css') {
        var sheets = [].slice.call(document.getElementsByTagName('link'))
        var head = document.getElementsByTagName('head')[0]
        for (var i = 0; i < sheets.length; i += 1) {
          var elem = sheets[i]
          var rel = elem.rel
          var href = elem.href
          if (rel === 'stylesheet') {
            var link = document.createElement('link')
            link.rel  = 'stylesheet'
            href = href.split('?')[0]
            link.href = href + '?_=' + (+new Date())
            head.appendChild(link)
            setTimeout(function () {
              head.removeChild(elem)
            })
          }
        }
      }
    }
    ws.onopen = function(e) {
      console.info('Socket connected')
    }
    ws.onclose = function(e) {
      if (times <= 10) {
        times += 1
        console.error('Socket closed, reconnecting...')
        setTimeout(socket, 5000)
      } else {
        console.info('Socket connect fail, Please refresh the browser')
      }
    }
  }
  if (!window.__PAVANE__) {
    socket()
    window.__PAVANE__ = true
  }
})()
