
// 字典树，又称前缀树，相比哈希表，可以高效处理：找到具有同一前缀的全部键值；按词典序枚举字符串的数据集；
// 与哈希表相比，Trie 树在存储多个具有相同前缀的键时可以使用较少的空间
class Trie {
  constructor() {
    this.root = new Map()
  }
  // 插入一个单词
  insert(word) {
    let node = this.root
    // 遍历word的字母
    for(let c of word) {
      // 没有这个字母就创建一个分支
      if (!node.has(c)) {
        node.set(c, new Map())
      }
      // 进入下一个节点
      node = node.get(c)
    }
    // 记录word次数
    if (!node.has('$')) {
      node.set('$', 0)
    }
    node.set('$', node.get('$') + 1)
  }
  // 找最多
  most() {
    let max = 0
    let maxWord = null
    let visit = (node, word) => {
      if (!(node instanceof Map)) return
      if(node.has('$') && node.get('$') > max) {
        max = node.get('$')
        maxWord = word
      }
      for (let p of node) {
        // p = [key, value]
        visit(p[1], word + p[0])
      }
    }
    visit(this.root, '')
    return maxWord
  }
  findNode(prefix) {
    let node = this.root
    for (let c of prefix) {
      if (!node.has(c)) return null
      node = node.get(c)
    }
    return node
  }
  search(word) {
    let node = this.findNode(word)
    if (!node) return false
    return node.has('$')
  }
  startsWith(prefix) {
    return this.findNode(prefix) ? true : false
  }
}

function randomWord(length) {
  let s = ''
  for (let i = 0; i < length; i++) {
    s += String.fromCharCode(Math.random() * 26 + 'a'.charCodeAt(0))
  }
  return s
}

let trie = new Trie()
for (let i = 0; i < 100000; i++) {
  trie.insert(randomWord(4))
}
const word = trie.most()
trie.startsWith(word)
