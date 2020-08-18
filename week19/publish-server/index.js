const http = require('http')
const fs = require('fs')
const unzipper = require('unzipper')

const unzip = unzipper.Extract({ path: '../server/public/' })

const server = http.createServer((req, res) => {
  let matched = req.url.match(/filename=([^&]+)/)
  let filename = matched && matched[1]
  if (!filename) return
  // let writeStream = fs.createWriteStream('../server/public/' + filename)
  req.pipe(unzip)
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain'})
    res.end('ok')
  })
})


server.listen(3100)