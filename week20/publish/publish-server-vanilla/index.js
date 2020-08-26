const http = require('http')
const fs = require('fs')
const unzipper = require('unzipper')
const https = require('https')


const server = http.createServer((req, res) => {
  // 处理auth
  if (req.url.match(/^\/auth/)) {
    return auth(req, res)
  }
  // 处理文件上传
  if (req.url.match(/filename=/)) {
    let matched = req.url.match(/filename=([^&]+)/)
    let filename = matched && matched[1]
    if (!filename) return
    let options = {
      host: 'api.github.com',
      path: `/user`,
      method: 'GET',
      headers: {
        'User-Agent': 'toy-publish-server',
        Authorization: 'token ' + req.headers.token,
      }
    }
    // 上传文件之前先根据token获取用户信息，判断权限
    const request = https.request(options, (response) => {
      let body = ''
      response.setEncoding('utf-8')
      response.on('data', (chunk) => {
        body += chunk
      })
      response.on('end', () => {
        let user = JSON.parse(body)
        console.log(user)
        // TODO：权限校验
        const unzip = unzipper.Extract({ path: '../server/public/' })
        // let writeStream = fs.createWriteStream('../server/public/' + filename)
        req.pipe(unzip)
        req.on('end', () => {
          res.writeHead(200, { 'Content-Type': 'text/plain'})
          res.end('ok')
        })
      })
    })
    request.on('error', (error) => {
      res.writeHead(200, { 'Content-Type': 'text/plain'})
      res.end('error')
    })
    request.end()
    return
  }
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  })
  res.end('page not found')
  return
})

function auth(req, res) {
  let code = req.url.match(/code=([^&]+)/)[1]
  let state = '123abc'
  let secret_id = 'Iv1.52608ee43173fad9'
  let secret_code = '8d385a364d608bbc197063c33dd9f947c723c1ac'
  let redirect_uri = encodeURIComponent('http://localhost:3100/auth')
  let params = `code=${code}&client_id=${secret_id}&client_secret=${secret_code}&state=${state}&redirect_uri=${redirect_uri}`
  
  let options = {
    host: 'github.com',
    path: `/login/oauth/access_token?${params}`,
    method: 'POST'
  }
  const request = https.request(options, (response) => {
    response.setEncoding('utf-8')
    let data = ''
    response.on('data', (chunk) => {
      console.log(chunk, response)
      data += chunk
    })
    response.on('end', (chunk) => {
      console.log(chunk, response)
      let result = data.match(/access_token=([^&]+)/)
      if (result) {
        let token = result[1]
        // res.writeHead(200, {
        //   'access_toke': token,
        //   'Content-Type': 'text/html'
        // })
        // res.end(`<a href="http://localhost:3200/?token=${token}">publish</a>`)
        // 重定向
        res.writeHead(302, {
          'Location': `http://localhost:3200/?token=${token}`,
        })
        res.end()
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain'})
        res.end('error')
      }
    })
  })
  
  request.on('error', (error) => {
    res.writeHead(200, { 'Content-Type': 'text/plain'})
    res.end('error')
  })
  request.end()
}


server.listen(3100, () => {
  console.log('publish server vanilla listening on http://localhost:3100')
})