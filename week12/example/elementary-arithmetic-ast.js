const regexp = /([0-9\.]+)|([ ]+)|([\r\n]+)|(\+)|(\-)|(\*)|(\/)|(\()|(\))/g
const dictionary = ['Number', 'whitespace', 'LineTerminator', '+', '-', '*', '/', '(', ')']

function* tokenize(source) {
  let result = null
  let lastIndex = 0
  
  do {
    // 匹配
    lastIndex = regexp.lastIndex
    result = regexp.exec(source)
    // 判断
    if (!result) break
    if (regexp.lastIndex - lastIndex > result[0].length) {
      // 有非法字符，报错
      throw new Error('Unexpected token "' + source.slice(lastIndex, regexp.lastIndex - result[0].length) + '"')
    }
    // 生成token
    let token = {
      type: null,
      value: null,
    }
    for(let i = 0; i < dictionary.length; i++) {
      if (result[i + 1]) {
        token.type = dictionary[i]
      }
    }
    token.value = result[0]
    yield token
  } while(result)
  
  yield {type: 'EOF'}
}

// ::= <AddtiveExpression> EOF
function Expression(source) {
  if (source[0].type === 'AddtiveExpression' && source[1].type === 'EOF') {
    let node = {
      type: 'Expression',
      children: [source.shift(), source.shift()]
    }
    source.unshift(node)
    return node
  }
  AddtiveExpression(source)
  return Expression(source)
}
// 加法生成式
// TODO: 要将生成式全部展开，才能判断出所有情况，将每个情况转换成代码即可
// ::= MultiplicativeExpression
//     AddtiveExpression + MultiplicativeExpression
//     AddtiveExpression - MultiplicativeExpression
function AddtiveExpression(source) {
  if (source[0].type === '(') {
    // token不是当前生成式处理的，抛给下层处理，再回调自身
    MultiplicativeExpression(source)
    return AddtiveExpression(source)
  }
  if (source[0].type === 'Number') {
    MultiplicativeExpression(source)
    return AddtiveExpression(source)
  }
  if (source[0].type === 'ParenthesizedExpression') {
    MultiplicativeExpression(source)
    return AddtiveExpression(source)
  }
  if (source[0].type === 'PrimaryExpression') {
    MultiplicativeExpression(source)
    return AddtiveExpression(source)
  }
  if (source[0].type === 'MultiplicativeExpression') {
    let node = {
      type: 'AddtiveExpression',
      children: source.shift()
    }
    source.unshift(node)
    return AddtiveExpression(source)
  }
  if (source[0].type === 'AddtiveExpression' &&
    source.length > 1 && source[1].type === '+'
  ) {
    let node = {
      type: 'AddtiveExpression',
      children: [source.shift(), source.shift()]
    }
    // 处理MultiplicativeExpression
    MultiplicativeExpression(source)
    node.children.push(source.shift())
    source.unshift(node)
    return AddtiveExpression(source)
  }
  if (source[0].type === 'AddtiveExpression' &&
    source.length > 1 && source[1].type === '-'
  ) {
    let node = {
      type: 'AddtiveExpression',
      children: [source.shift(), source.shift()]
    }
    // 处理MultiplicativeExpression
    MultiplicativeExpression(source)
    node.children.push(source.shift())
    source.unshift(node)
    return AddtiveExpression(source)
  }
  if (source[0].type === 'AddtiveExpression') {
    return source[0]
  }
}

// ::= PrimaryExpression
//     MultiplicativeExpression * PrimaryExpression
//     MultiplicativeExpression / PrimaryExpression
function MultiplicativeExpression(source) {
  if (source[0].type === '(') {
    PrimaryExpression(source)
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'Number') {
    PrimaryExpression(source)
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'ParenthesizedExpression') {
    PrimaryExpression(source)
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'PrimaryExpression') {
    let node = {
      type: 'MultiplicativeExpression',
      children: source.shift()
    }
    source.unshift(node)
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'MultiplicativeExpression' &&
    source.length > 1 && source[1].type === '*'
  ) {
    let node = {
      type: 'MultiplicativeExpression',
      children: [source.shift(), source.shift(), source.shift()]
    }
    source.unshift(node)
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'MultiplicativeExpression' &&
    source.length > 1 && source[1].type === '/'
  ) {
    let node = {
      type: 'MultiplicativeExpression',
      children: [source.shift(), source.shift(), source.shift()]
    }
    source.unshift(node)
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'MultiplicativeExpression') {
    return source[0]
  }
  throw new Error('')
}
// 原子
// ::= Number
//     ParenthesizedExpression
function PrimaryExpression(source) {
  if (source[0].type === '(') {
    ParenthesizedExpression(source)
    return PrimaryExpression(source)
  }
  if (source[0].type === 'Number') {
    let node = {
      type: 'PrimaryExpression',
      children: source.shift()
    }
    source.unshift(node)
    return PrimaryExpression(source)
  }
  if (source[0].type === 'ParenthesizedExpression') {
    let node = {
      type: 'PrimaryExpression',
      children: source.shift()
    }
    source.unshift(node)
    return PrimaryExpression(source)
  }
  if (source[0].type === 'PrimaryExpression') {
    return source[0]
  }
}
// 括号表达式
// ::= "(" AddtiveExpression ")"
function ParenthesizedExpression(source) {
  if (source[0].type === 'ParenthesizedExpression') {
    return source[0]
  }
  if (source[0].type === '(' && source[0].type === 'AddtiveExpression') {
    let node = {
      type: 'ParenthesizedExpression',
      children: [source.shift(), source.shift(), source.shift()]
    }
    source.unshift(node)
    return ParenthesizedExpression(source)
  }
  if (source[0].type === '(') {
    let node = {
      type: 'ParenthesizedExpression',
      children: [source.shift()],
    }
    AddtiveExpression(source)
    node.children.push(source.shift())
    node.children.push(source.shift())
    source.unshift(node)
    return ParenthesizedExpression(source)
  }
}

let source = []
for (let token of tokenize('(1+2)*3+4')) {
  if (token.type !== 'whitespace' && token.type !== 'LineTerminator') {
    source.push(token)
  }
}
// const res = MultiplicativeExpression(source)
// const res = AddtiveExpression(source)
const res = Expression(source)
console.log(res)