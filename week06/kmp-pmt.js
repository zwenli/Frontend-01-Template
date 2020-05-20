// const p = 'abaabac'

// const next = [0,0,1,1,2,3,0]

function getNext(p) {
  const next = [0]
  let i = 1 // 模版串当前匹配的配置
  let now = 0 
  while (i < p.length) {
    if (p[i] === p[now]) {
      // 两个字符相等，向右拓展一位
      now += 1
      i += 1
      next.push(now)
    } else if (now) {
      // 不相等，now不为0，缩小now
      // next[i] = 0
      now = next[now - 1]
    } else {
      // 不相等，now不为0，无法再缩小，顾next[i] = 0 
      next.push(0)
      i += 1
    }
  }
  return next
}

// const nextArr = getNext(p)
// console.log(nextArr)

function match(p, s) {
  const next = getNext(p)
  let tar = 0 // 主串中要匹配的的位置
  let pos = 0 // 模式串中将要匹配的位置
  while ( tar < s.length) {
    if (p[pos] === s[tar]) {
      // 两个字符相等，各进一位
      tar += 1
      pos += 1
    } else if (pos){
      // 两个字符不匹配，但pos不为0，主串位置不变，根据next数组移动模式串的位置
      pos = next[pos - 1]
    } else {
      // pos为0，主串直接进一位
      tar += 1
    }
    
    if (pos === p.length) {
      return true
    }
  }
  return false
}

const res1 = match('abaabac', 'ababaabaabaccaadx')

const res2 = match('abaabac', 'ababaabaabaxcaadx')

const res3 = match('abxxabxy', 'aaaabxabxxabxxabxyxxx')
const res4 = match('abxxabxy', 'aaaabxabxxabxxabxcxxx')

console.log(res1)
console.log(res2)
console.log(res3)
console.log(res4)