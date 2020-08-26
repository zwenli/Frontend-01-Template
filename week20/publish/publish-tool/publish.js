const http = require('http')
const fs = require('fs')
const archiver = require('archiver')
const child_process = require('child_process')
const packname = './package'
const archive = archiver('zip', {
  zlib: {
    level: 9
  } // Sets the compression level.
})
archive.directory(packname, false)
archive.finalize()

// 打开浏览器，获取token
child_process.exec('open https://github.com/login/oauth/authorize?client_id=Iv1.52608ee43173fad9&state=123abc')

// 等待publist server 回传token
const server = http.createServer((req, res) => {
  console.log('real publish!', req)
  let result = req.url.match(/token=([^&]+)/)
  if (!result) {
    res.writeHead(200, { 'Content-Type': 'text/plain'})
    res.end('token is required!')
    return
  }
  let token = result[1]
  const options = {
    hostname: 'localhost',
    port: 3100,
    path: '/?filename=package.zip',
    method: 'POST',
    headers: {
      'token': token,
      'Content-Type': 'application/octet-stream',
    }
  }

  const request = http.request(options, (response) => {
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    response.setEncoding('utf8')
    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
    })
    response.on('end', () => {
      console.log('No more data in response.');
      res.writeHead(200, { 'Content-Type': 'text/plain'})
      res.end('publish done!')
    })
  })

  // in.pipe(out)
  archive.pipe(request)
  archive.on('end', () => {
    request.end()
  })
  
})

server.listen(3200)
