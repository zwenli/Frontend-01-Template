const net = require('net')

class Request {
  // method, url = host + port + path
  // body: k=v
  // headers
  constructor(options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.port = options.port || 80
    this.path = options.path
    this.body = options.body || {}
    this.headers = options.headers || {}
    
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    }else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }
    
    this.headers['Content-Length'] = this.bodyText.length
    
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1
Host: ${this.host}
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n
${this.bodyText}`
  }
  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser()
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port,
        }, () => {
          connection.write(this.toString())
        })
      }
      connection.on('data', (data) => {
        // 数据是流式的，会触发n次data事件，
        parser.receive(data.toString())
        // resolve(data.toString())
        // console.log(parser.statusLine)
        // console.log(parser.headers)
        // console.log(parser.body)
        if (parser.isFinished) {
          resolve(parser.response)
          connection.end()
        }
      })
      connection.on('end', () => {
        console.log('disconnected from server');
      })
      connection.on('error', (err) => {
        reject(error)
        connection.end()
      })
    })
  }
}

class Response {}

/**用状态机解析响应内容 */
class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0
    this.WAITING_STATUS_LINE_END = 1
    this.WAITING_HEADER_NAME = 2
    this.WAITING_HEADER_SPACE = 3
    this.WAITING_HEADER_VALUE = 4
    this.WAITING_HEADER_LINE_END = 5
    this.WAITING_HEADER_BLOCK = 6
    this.WAITING_HEADER_BLOCK_END = 7
    this.WAITING_BODY = 8

    this.current = this.WAITING_STATUS_LINE
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
    this.statusCode = ''
    this.body = ''
    this.bodyParser = null
  }
  get isFinished () {
    return this.bodyParser && this.bodyParser.isFinished
  }
  get response () {
    this.statusLine.match(/HTTP\/1.1 (\d+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }

  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END
      } else {
        this.statusLine += char
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END
      } else if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE
      } else {
        this.headerName += char
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END
        this.headers[this.headerName] = this.headerValue
        this.headerName = ''
        this.headerValue = ''
      } else {
        this.headerValue += char
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new ThunkedBodyParse()
        }
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char)
    }
  }
}

class ThunkedBodyParse {
  constructor() {
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_LINE_END = 1
    this.READING_CHUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4
    this.length = 0
    this.current = this.WAITING_LENGTH
    this.content = []
    this.isFinished = false
  }
  receiveChar(char) {
    // console.log(JSON.stringify(char))
    if (!this.isFinished && this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        this.current = this.WAITING_LENGTH_LINE_END
        if (this.length === 0) {
          this.isFinished = true
        }
      } else {
        this.length *= 16
        const codePoint = char.codePointAt(0)
        if (codePoint >= 48 && codePoint <= 57) {
          this.length += codePoint - 48
        } else if (codePoint >= 65 && codePoint < 81) {
          this.length += codePoint - 55
        } else if (codePoint >= 97 && codePoint < 107) {
          this.length += codePoint - 87
        }
      }
    } else if (!this.isFinished && this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.current = this.READING_CHUNK
      }
    } else if (!this.isFinished && this.current === this.READING_CHUNK) {
      this.content.push(char)
      this.length -= 1
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE
      }
    } else if (!this.isFinished && this.current === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END
      }
    } else if (!this.isFinished && this.current === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH
      }
    }
  }
}

void async function() {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8080,
    path: '/',
    headers: {
      'X-FOO': 'abc',
    },
    body: {
      name: 'hello',
    }
  })
  
  let data = await request.send()
  console.log(data)
}()


// http 是一个文本协议

// const client = net.createConnection({ port: 8080 }, () => {
//   // 'connect' listener.
//   console.log('connected to server!');
//   // client.write('world!\r\n');
//   // client.write('POST / HTTP/1.1\r\n')
//   // client.write('Host: 127.0.0.1\r\n')
//   // client.write('Content-Type: application/x-www-form-urlencoded\r\n')
//   // client.write('\r\n')
//   // client.write('hello')
//   // client.write('\r\n')
//   let request = new Request({
//     method: 'POST',
//     host: '127.0.0.1',
//     port: 8080,
//     path: '/',
//     headers: {
//       'X-FOO': 'abc',
//     },
//     body: {
//       name: 'hello',
//     }
//   })
//   console.log(request.toString())
//   client.write(request.toString())

// });
// client.on('data', (data) => {
//   console.log('data reserved: ----')
//   console.log('----', data.toString());
//   client.end();
// });
// client.on('end', () => {
//   console.log('disconnected from server');
// });