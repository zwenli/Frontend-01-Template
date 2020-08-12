const fsevents = require('fsevents')
const httpServer = require('http-server')
const webpack = require('webpack')
const webpackConfig = require('../webpack.config')
const { exec } = require('child_process')

// function webpackBuild() {
//   webpack(webpackConfig, (err, stats) => {
//     if (err) throw err
//     console.log(stats.toString())
//   })
// }
// webpack
// webpackBuild()

// server
const server = httpServer.createServer({
  root: './dist',
})

server.listen(9000, () => {
  console.log('server start: http://localhost:9000')
})

const stop = fsevents.watch(__dirname, (path, flags, id) => {
  const info = fsevents.getInfo(path, flags, id)
  // console.log(info)
  console.log('webpack build start')
  // webpackBuild()
  exec('npm run build')
}) // To start observation