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
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div>
        <img id="myid"/>
        <img />
    </div>
</body>
</html>`)
});

server.listen(8080)