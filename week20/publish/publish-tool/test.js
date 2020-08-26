const child_process = require('child_process')
// child_process.exec('open https://github.com/login/oauth/authorize?client_id=Iv1.52608ee43173fad9&state=123abc')
const http = require('http')
const querystring = require('querystring')
const {URL} = require('url')

var server = http.createServer((req, res) => {
  let msg = ''
  req.on('data', (chunk) => {
    msg += chunk.toString()
  })
  req.on('end', () => {
    console.log('client send msg: ', JSON.stringify(querystring.parse(msg)))
    // res.setEncoding('utf8');
    res.write('hello \r\n')
    res.end()
  })
})
server.listen(6000)

setInterval(() => {
  // const req = http.request('http://localhost:6000', {
  //   method: 'GET',
  // }, (res) => {
  //   let msg = ''
  //   res.on('data', (chunk) => {
  //     msg += chunk.toString()
  //   })
  //   res.on('end', () => {
  //     console.log('received msg: ', msg)
  //   })
  // })
  // // req.on('error', (err) => {
  // //   console.log('req error: ', err)
  // // })
  // // end之前仍可以setHeader(name, value), getHeader(name), removeHeader(name)
  // req.setHeader('foo', '321')
  // console.log('headers: ', req.getHeaders())
  // // 必须要调用end，才是实际发送请求
  // req.end()
  
  // POST的例子
  const postData = querystring.stringify({
    'msg': 'good morning'
  })
  const url = new URL('http://localhost:6000/msg')
  const req = http.request({
    host: url.hostname,
    port: url.port,
    path: url.pathname,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let msg = ''
    res.on('data', (chunk) => {
      msg += chunk.toString()
    })
    res.on('end', () => {
      console.log('received msg: ', msg)
    })
  })
  req.on('error', (err) => {
    console.log('req error: ', err)
  })
  req.write(postData)
  req.end()
}, 2000)