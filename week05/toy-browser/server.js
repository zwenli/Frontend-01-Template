const http = require('http')

const server = http.createServer(function(req, res) {
  console.log('reserver request: ' + req.method + ' ' + req.url)
  console.log('request headers', req.headers)
  console.log('request ')
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('X-Foo', 'abc')
  res.writeHead(200, {
  })
  res.end('okokokokokokokokokokokokok')
});

server.listen(8080)