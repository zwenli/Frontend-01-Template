
// * 的逻辑，最后一个匹配多，其他匹配少

function isMatch(source, pattern) {
  let starCount = 0
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] ===  '*') {
      starCount += 1
    }
  }
  
  // 没有*的对比
  if (starCount === 0) {
    if (pattern.length !== source.length) return false
    for (let i = 0; i < source.length; i++)  {
      if (pattern[i] !== source[i] && pattern[i] !== '?') {
        return false
      }
    }
    return true
  }
  
  // 处理*的头
  let c = 0 // pattern的下标
  while(c < pattern.length && pattern[c] !== '*') {
    // source 边界处理，
    if (source.length - c <= 0) {
      return false
    }
    if (pattern[c] !== source[c] && pattern[c] !== '?') {
      return false
    }
    c += 1
  }
  
  let lastIndex = c // source下次匹配开始的下标
  let starIndex = 0
  // 处理*的中间子串，除了尾
  while(c < pattern.length && starIndex < starCount) {
    if (pattern[c] === '*') {
      starIndex += 1
      c += 1
      continue
    }
    
    let subPattern = ''
    while (c < pattern.length && pattern[c] !== '*') {
      subPattern += pattern[c]
      c += 1
    }
    const regexp = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g')
    regexp.lastIndex = lastIndex
    const res = regexp.exec(source)
    if (!res) return false
    lastIndex = regexp.lastIndex
  }
  
  // 处理* 最后的子串,从右到左匹配
  for(let j = 1; j <= pattern.length - c; j++) {
    // source 边界处理，
    if (source.length - lastIndex < j) {
      return false
    }
    if (
      pattern[pattern.length - j] !== source[source.length - j] &&
      pattern[pattern.length - j] !== '?'
    ) {
      return false
    }
  }
  return true
}

const res1 = isMatch("mississippi", "m??*ss*?i*pi") // false
const res2 = isMatch("abc", "abc?*") // false
console.log(res1)
console.log(res2)

/**
 * 可以拆解称
 * a**b
 * a??b
 * 
 * 对于*，最后一个是贪婪匹配，其他是尽量少匹配，
 * 
 * abbbbb
 * a*b
 * 最后一个子串可以去掉，和text的最后一样的情况下，这样就变成了
 * abbbb
 * a*
 * 
 * * + kmp
 * 
 * 处理没有*的情况，
 * 处理*的头尾，处理*的分段
 */