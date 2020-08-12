const tty = require('tty')
const ttys = require('ttys')
const readline = require('readline')


const stdin = ttys.stdin
const stdout = ttys.stdout

stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf-8')

function getChar() {
  return new Promise((resolve) => {
    stdin.once('data', key => {
      resolve(key)
    })
  })
}

function up(n = 1) {
  stdout.write('\033['+n+'A')
}

function down(n = 1) {
  stdout.write('\033['+n+'B')
}

function right(n = 1) {
  stdout.write('\033['+n+'C')
}

function left(n = 1) {
  stdout.write('\033['+n+'D')
}

/*
void async function() {
  while(true) {
    let char = await getChar()
    if (char === '\u0003') {
      process.exit()
      break
    }
    console.log(char.split('').map(c => c.charCodeAt(0)))
  }
}()
*/


void async function() {
  stdout.write('which framework do you want to use? \n')
  let answer = await select(['vue', 'react', 'angular'])
  stdout.write('you select ' + answer + '\n')
  process.exit()
}()

// red \x1b[31m
// reset \x1b[0m
async function select(choices) {
  let selected = 0
  for (let i = 0; i < choices.length; i++) {
    let choice = choices[i]
    if (i === selected) {
      stdout.write('[\x1b[31mx\x1b[0m] ' + choice + '\n')
    } else {
      stdout.write('[ ] ' + choice + '\n')
    }
  }
  // 光标返回到第一个选项的[ ]
  up(choices.length)
  right()
  
  while(true) {
    let char = await getChar()
    if (char === '\u0003') {
      process.exit()
      break
    }
    if (char === 'w' && selected > 0) {
      stdout.write(' ')
      // 覆盖完成需要在左移回之前的位置
      left()
      selected -= 1
      up()
      stdout.write('\x1b[31mx\x1b[0m')
      left()
    }
    if (char === 's' && selected < choices.length - 1) {
      stdout.write(' ')
      left()
      selected += 1
      down()
      stdout.write('\x1b[31mx\x1b[0m')
      left()
    }
    if (char === '\r') {
      // 回车后，光标回到选项的下一行
      down(choices.length - selected)
      left()
      return choices[selected]
    }
  }
}