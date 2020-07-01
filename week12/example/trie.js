// 字典树，又称前缀树，相比哈希表，可以高效处理：找到具有同一前缀的全部键值；按词典序枚举字符串的数据集；
  // 与哈希表相比，Trie 树在存储多个具有相同前缀的键时可以使用较少的空间
class Trie {
  constructor() {
    this.root = Object.create(null)
    // this.root = new Map()
  }
  // 插入一个单词
  insert(word) {
    let node = this.root
    // 遍历word的字母
    for(let c of word) {
      // 没有这个字母就创建一个分支
      if (!node[c]) {
        node[c] = Object.create(null)
      }
      // 进入下一个节点
      node = node[c]
    }
    // 记录word次数
    if (!('$' in node)) {
      node.$ = 0
    }
    node.$ ++
  }
  // 找最多
  most() {
    let max = 0
    let maxWord = null
    let visit = (node, word) => {
      if(node.$ && node.$ > max) {
        max = node.$
        maxWord = word
      }
      for (let p in node) {
        visit(node[p], word + p)
      }
    }
    visit(this.root, '')
    console.log(maxWord)
  }
  // 找前50多的单词，用二叉堆，大顶堆
  // 找单词
  // 找单词前缀
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
