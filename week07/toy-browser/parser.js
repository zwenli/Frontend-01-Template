const css = require('css')
const layout = require('./layout')
const EOF = Symbol('EOF'); // EOF: End of file

/**
 * 标准 https://html.spec.whatwg.org/multipage/parsing.html#tokenization
 */

let currentToken = null
let currentAttribute = null
let currentTextNode = null
let stack = [{type: 'document', children: [], parent: null}]

/**
 * cssparse
 * 
 */

// 用来存所有的cssRuls
let rules = []

function addCssRules(text) {
  const ast = css.parse(text)
  // console.log(JSON.stringify(ast, null, '  '))
  rules.push(...ast.stylesheet.rules)
}

function match(element, selector) {
  // console.log('match element')
  if (!selector || !element.attributes) {
    return false
  }
  
  // 简单选择器匹配
  if(selector.charAt(0) === '#') {
    var attr = element.attributes.filter(attr => attr.name === 'id')[0]
    if (attr && attr.value === selector.replace('#', '')) {
      return true
    }
  } else if (selector.charAt(0) === '.') {
    var attr = element.attributes.filter(attr => attr.name === 'class')[0]
    // if (attr && attr.value === selector.replace('.', '')) {
    //   return true
    // }
    // 支持空格的class
    if (attr && attr.value.split(' ').includes(selector.replace('.', ''))) {
      return true
    }
  } else if (element.tagName === selector) {
    return true
  }
  return false
}

/** 优先级 */
function specificity(selector) {
  const sp = [0,0,0,0]
  const selectorParts = selector.split(' ')
  for (let p of selectorParts) {
    if (p.charAt(0) === '#') {
      sp[1] += 1
    } else if (p.charAt(0) === '.') {
      sp[2] += 1
    } else {
      sp[3] += 1
    }
  }
  return sp
}

/** 优先级对比 1>2:1, 1=2:0, 1<2:-1 */
function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
      return sp1[0] - sp2[0]
  }
  if (sp1[1] - sp2[1]) {
      return sp1[1] - sp2[1]
  }
  if (sp1[2] - sp2[2]) {
      return sp1[2] - sp2[2]
  }
  return sp[3]- sp[3]
}

function computeCSS(element) {
  /**
   * 正常情况下，浏览器获取到rules后，需要重绘
   * （将之前没有作用cssrules的element重新计算）
   * 在这里忽略这个
   */
  // console.log('css rules, ', rules)
  // console.log('computed css for this element', element)
  // 不包含当前元素
  const elements = stack.slice().reverse()
  
  if (!element.computedStyle) {
    element.computedStyle = {}
  }
  
  for (rule of rules) {
    const selectorParts = rule.selectors[0].split(' ').reverse()
    
    // 如果匹配不到当前元素，继续下个循环
    if (!match(element, selectorParts[0])) {
      continue
    }
    
    let j = 1
    let matched = false
    for(let i = 0; i <= elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j += 1
        if (j === selectorParts.length) {
          break
        }
      }
    }
    
    if (j >= selectorParts.length) {
      // 当前元素和这条规则匹配
      matched = true
    }
    
    if (matched) {
      // 匹配到规则，加入
      // console.log('element: ', element, 'matched rule:', rule)
      const sp = specificity(rule.selectors[0])
      const computedStyle = element.computedStyle
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
          // for (let k = 0; k < 4; k++) {
          //   computedStyle[declaration.property][declaration.value][k] += sp[k]
          // }
        }
      }
      // console.log(element.computedStyle)
    }
    
    // 行内样式处理
    
  }
}


/**
 * htmlparse
 * 
 */

function emit(token) {
  // if (token.type !== 'text') {
  //   console.log(token)
  // }
  let top = stack[stack.length - 1]
  
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: [],
      parent: top,
    }
    element.tagName = token.tagName
    for (let p in token) {
      if (p !== 'tagName' && p !== 'type') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }
    
    // 应用css规则
    computeCSS(element)
    top.children.push(element)
    
    if (!token.isSelfClosing) {
      stack.push(element)
    }
    
    currentTextNode = null
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('Tag start end doesn\'t match')
    } else {
      /** 遇到style标签，添加css规则，结束时此时文本节点的才有内容 */
      if (top.tagName === 'style') {
        addCssRules(top.children[0].content)
      }
      /**在end tag 计算布局 */
      layout(top)
      stack.pop()
    }
    currentTextNode = null
    
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return ;
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen
  }else if (c.match(/^[0-9A-Za-z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
      // attributes: [],
    }
    currentAttribute = null
    return tagName(c)
  } else {
    // return 
    return data(c)
  }
}

function endTagOpen(c) {
  if (c.match(/^[0-9A-Za-z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if (c === '>') {
    // This is a missing-end-tag-name parse error. 
    return data
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    // Reconsume in the bogus comment state.
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    // Emit the current tag token
    emit(currentToken)
    return data
  } else if (c.match(/^[0-9A-Za-z]$/)) {
    // Append the lowercase version of the current input character
    // (add 0x0020 to the character's code point) 
    // to the current tag token's tag name.
    currentToken.tagName += c.toLocaleLowerCase()
    return tagName
  } else {
    // Append the current input character to the current tag token's tag name.
    currentToken.tagName += c
    return tagName
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    // This is an unexpected-equals-sign-before-attribute-name parse error.
    return attributeName
  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
  // 暂时不处理属性
  // if (c.match(/^[\t\n\f ]$/)) {
  //   return beforeAttributeName
  // } else if (c === '/') {
  //   return selfClosingStartTag
  // }else if (c === '>') {
  //   return tagName(c)
  // } else if (c === '=') {
  //   return beforeAttributeName
  // } else {
  //   return beforeAttributeName
  // }
  
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName(c)
  } else if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c.match(/^[0-9A-Za-z]$/)) {
    currentAttribute.name += c.toLocaleLowerCase()
    return attributeName
  } else if (c === '"' || c === '\'' || c === '<') {
    // This is an unexpected-character-in-attribute-name parse error.
    // Treat it as per the "anything else" entry below.
  } else {
    currentAttribute.name += c
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else if (c === EOF) {
    // This is an eof-in-tag parse error. Emit an end-of-file token.
    emit({
      type: 'EOF'
    })
    return
  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeValue
  } else if (c === '"') {
    return doubleQuotedAttributeValue
  } else if (c === '\'') {
    return singleQuotedAttributeValue
  } else if (c === '>') {
    // This is a missing-attribute-value parse error. 
    emit(currentToken)
    return data
  } else {
    return unquotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {
    
  }else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if (c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {
    
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    currentAttribute.value += c
    return singleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    // This is a missing-whitespace-between-attributes parse error.
    return beforeAttributeName(c)
  }
}

function unquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  }else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === '"' || c === '\'' || c === '<' || c === '=' || c === '`') {
    // This is an unexpected-character-in-unquoted-attribute-value parse error.
    // Treat it as per the "anything else" entry below.
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    currentAttribute.value += c
    return unquotedAttributeValue
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    // Set the self-closing flag of the current tag token.
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if(c === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    return beforeAttributeName(c)
  }
}
// function afterAttribute(c) {}


module.exports.parseHTML = function (html) {
  // console.log(body)
  let state = data
  for(let c of html) {
    // console.log('字符: ', c)
    state = state(c)
  }
  state = state(EOF)
  // console.log(stack[0])
  return stack[0]
}