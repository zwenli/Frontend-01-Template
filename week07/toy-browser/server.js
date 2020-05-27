const http = require('http')

const server = http.createServer(function(req, res) {
  console.log('reserver request: ' + req.method + ' ' + req.url)
  console.log('request headers', req.headers)
  console.log('request ')
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('X-Foo', 'abc')
  res.writeHead(200, {
  })
  res.end(
`<html maaa=a >
<head>
  <style>
    body {
      background-color: rgb(0,0,0);
    }
    .container {
      display: flex;
      width: 500px;
      flex-wrap: wrap;
      background-color: rgb(255,255,255);
    }
    .item1 {
      height: 100px;
      width: 200px;
      background-color: rgb(255,0,0);
    }
    .item2 {
      height: 200px;
      width: 200px;
      background-color: rgb(0,255,255);
    }
    .item3 {
      height: 150px;
      width: 300px;
      background-color: rgb(0,255,0);
    }
    .item4 {
      height: 150px;
      width: 100px;
      background-color: rgb(0,0,255);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="item1"></div>
    <div class="item2"></div>
    <div class="item3"></div>
    <div class="item4"></div>
  </div>
</body>
</html>`)
});

server.listen(8080)