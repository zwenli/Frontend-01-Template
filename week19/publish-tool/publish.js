const http = require('http')
const fs = require('fs')
const archiver = require('archiver')

const packname = './package'

const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
})

archive.directory(packname, false)

archive.finalize();

const options = {
  hostname: 'localhost',
  port: 3100,
  path: '/?filename=package.zip',
  method: 'POST',
  headers: {
    'Content-Type': 'application/octet-stream',
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  // res.setEncoding('utf8');
  // res.on('data', (chunk) => {
  //   console.log(`BODY: ${chunk}`);
  // });
  // res.on('end', () => {
  //   console.log('No more data in response.');
  // });
});

archive.pipe(req)
req.on('end', () => {
  req.end();
})
