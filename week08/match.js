// 复杂选择器
function match(selector, element) {
  // combinator <sp>, +, ~, >; sp = \t\r\n\f
  const selectorSequences = getSelectorSequences(selector).reverse()
  console.log('selectorSequences: ', selectorSequences)
  let currentElement = element
  
  if (!matchSimpleSelectorSequence(selectorSequences[0], currentElement)) {
    return false
  }
  let index = 1
  while (currentElement.parentNode && index < selectorSequences.length) {
    if (selectorSequences[index] === '>') {
      // child combinator
      // 消费当前的，获取下一个SelectorSequence
      index += 1
      currentElement = currentElement.parentNode
      if (!matchSimpleSelectorSequence(selectorSequences[index], currentElement)) {
        return false
      }
      index += 1
    } else if (selectorSequences[index] === '+') {
      // adjacent sibling combinator
      index += 1
      const siblingIndex = Array.prototype.findIndex.call(currentElement.parentNode.childNodes, item => item === currentElement)
      if (siblingIndex <= 0) {
        // 没有相邻兄弟节点
        return false
      }
      currentElement = currentElement.parentNode.childNodes[siblingIndex - 1]
      if (!matchSimpleSelectorSequence(selectorSequences[index], currentElement)) {
        return false
      }
      index += 1
    } else if (selectorSequences[index] === '~') {
      // general sibling combinator
      index += 1
      const { childNodes } = currentElement.parentNode
      let siblingIndex = Array.prototype.findIndex.call(childNodes, item => item === currentElement)
      if (siblingIndex <= 0) {
        // 没有兄弟节点
        return false
      }
      siblingIndex -= 1
      // 遍历兄弟节点
      while(siblingIndex >= 0) {
        if (matchSimpleSelectorSequence(selectorSequences[index], childNodes[siblingIndex])) {
          currentElement = childNodes[siblingIndex]
          index += 1
          break
        }
        siblingIndex -= 1
      }
      if (siblingIndex < 0) {
        // 找不到匹配的兄弟节点
        return false
      }
    } else {
      currentElement = currentElement.parentNode
      if (matchSimpleSelectorSequence(selectorSequences[index], currentElement)) {
        index += 1
      }
    }
  }
  
  return index >= selectorSequences.length
}

// 拆分复杂选择器，获取SelectorSequence列表
function getSelectorSequences(selector) {
  // .cls1 > #ab1[attr] div.cls3~span#id3
  const EOF = Symbol('EOF')
  const selectorSequences = []
  let selectorSequence = ''
  
  let state = beforeSelectorState
  for (let char of selector) {
    state = state(char)
  }
  state = state(EOF)
  
  return selectorSequences
  
  function beforeSelectorState(char) {
    if (char === EOF) {
      return endState()
    } else if (char.match(/[ \t\r\n\f]/)) {
      return beforeSelectorState
    } else if (char.match(/[\+\~\>]/)) {
      return selectorState(char)
    } else if (char === EOF) {
      return endState()
    } else {
      // char.match(/[\_a-z0-9\-\#\.\[\]\*\=]/)
      return selectorState(char)
    }
  }
  function selectorState(char) {
    if (char === EOF) {
      return endState()
    } else if (char.match(/[ \t\r\n\f]/)) {
      selectorSequences.push(selectorSequence)
      selectorSequence = ''
      return beforeSelectorState
    } else if (char.match(/[\+\~\>]/)) {
      if (selectorSequence) {
        selectorSequences.push(selectorSequence)
      }
      selectorSequences.push(char)
      selectorSequence = ''
      return beforeSelectorState
    }  else {
      // char.match(/[\_a-z0-9\-\#\.\[\]\*\=]/)
      selectorSequence += char
      return selectorState
    } 
  }
  function endState() {
    if (selectorSequence) {
      selectorSequences.push(selectorSequence)
    }
    return endState
  }
}

// 复合选择器
function matchSimpleSelectorSequence(selectorSequence, element) {
  // 暂实现 通配，id，class，属性，部分伪类
  const selectors = selectorSequence.split(/(?=[#\.\[\:])/)
  console.log('current selectors: ', selectors)
  while (selectors.length) {
    const selector = selectors.shift()
    if (!matchSimpleSelector(selector, element)) {
      return false
    }
  }
  return true
}

function matchSimpleSelector(selector, element) {
  if (!selector || !element) {
    return false
  }
  if (selector === '*') {
    return true
  } else if (selector.charAt(0) === '#') {
    return element.getAttribute('id') === selector.slice(1)
  } else if (selector.charAt(0) === '.') {
    return element.getAttribute('class').split(' ').some(val => val === selector.slice(1))
  } else if (selector.charAt(0) === '[') {
    return matchAttribSeletor(selector, element)
  } else if (selector.charAt(0) === ':') {
    return matchPseudoClassesSeletor(selector, element)
  } else {
    return element.tagName === selector.toUpperCase()
  }
}

// 属性选择器
function matchAttribSeletor(selector, element) {
  // TODO: 不支持value 带\"\'空格的表达式
  const reg = /^(?:\[)([a-zA-Z0-9\_\-]+)(?:(\=|\~\=|\|\=|\^\=|\$\=|\*\=)([a-zA-Z0-9\_\-]*))?(?:\])$/
  if (selector.match(reg)) {
    if (!RegExp.$2) {
      return element.hasAttribute(RegExp.$1)
    } else if (RegExp.$2 === '=') {
      return element.getAttribute(RegExp.$1) === RegExp.$3
    } else if (RegExp.$2 === '~=') {
      return element.getAttribute(RegExp.$1).split(' ').some(val => val === RegExp.$3)
    } else if (RegExp.$2 === '|=') {
      const attribute = element.getAttribute(RegExp.$1)
      return attribute === RegExp.$3
        || attribute.startsWith(RegExp.$3 + '-')
    } else if (RegExp.$2 === '^=') {
      return element.getAttribute(RegExp.$1).startsWith(RegExp.$3)
    } else if (RegExp.$2 === '$=') {
      return element.getAttribute(RegExp.$1).endsWith(RegExp.$3)
    } else if (RegExp.$2 === '*=') {
      return element.getAttribute(RegExp.$1).includes(RegExp.$3)
    }
  }
  return false
}

// 伪类选择器
function matchPseudoClassesSeletor(selector, element) {
  // :empty :first-child :last-child :not
  // :nth-child类头大不想搞
  if (selector === ':empty') {
    const length = element.childrenNodes.filter(node => (node.nodeType === 1 || node.nodeType === 3)).length
    return length === 0
  } else if (selector.startsWith(':not')) {
    const p = selector.slice(5, -1).trim()
    return !match(p, element)
  } else if (selector  === ':first-child') {
    return element.parentElement.children[0]=== element
  } else if (selector === ':last-child') {
    const { length } = element.parentElement.children
    if (length > 0) {
      return element.parentElement.children[length - 1]=== element
    }
    return false
  }
  return false
}

// let list = getSelectorSequences('div.article[attr=content] + div#sidebar-quicklinks.sidebar')
// console.log(list)
