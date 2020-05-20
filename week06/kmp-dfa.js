/**
 * 1、https://www.cnblogs.com/courtier/p/4273193.html
 * 2、https://juejin.im/post/5eb7b5656fb9a0437e0e9596#heading-3
 */
function makeDfa(pat) {
  const R = 256 // ASCII范围
  const M = pat.length
  const dfa = Array(R).fill([]).map(arr => Array(M).fill(0))
  
  dfa[pat.codePointAt(0)][0] = 1 // 首个字母的0位必定是1
  let X = 0
  for (let j = 1; j < M; j++) {
    
    for (let c = 0; c < R; c++) {
      dfa[c][j] = dfa[c][X] // 前一个X所代表的列赋值给当前列
    }
    
    dfa[pat.codePointAt(j)][j] = j + 1
    
    X = dfa[pat.codePointAt(j)][X]
  }
  
  return dfa
}

// let dfa = makeDfa('ababac')
// console.log(dfa)

function match(pat, txt) {
  const patLength = pat.length
  const txtLength = txt.length
  const dfa = makeDfa(pat)
  let j = 0
  let i = 0
  while (i < txtLength && j < patLength) {
    j = dfa[txt.codePointAt(i)][j] // 确定下一个状态的位置
    i += 1
  }
  
  if (j === patLength) {
    return i - patLength
  }
  return -1
}


const res1 = match('ababac', 'ababababacaccaadx') // 4
const res2 = match('ababac', 'ababaabaabaxcaadx') // -1
const res3 = match('abxxabxy', 'aaaabxabxxabxxabxyxxx') // 10
const res4 = match('abxxabxy', 'aaaabxabxxabxxabxcxxx') // -1

console.log(res1)
console.log(res2)
console.log(res3)
console.log(res4)