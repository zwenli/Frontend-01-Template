/**
 * 回溯
 * @param {string} s 
 * @param {string} p
 * @return {boolean}
 */
function isMatch(s, p) {
  // 状态初始化
  const sLen = s.length
  const pLen = p.length
  let starIndex = -1
  let sTempIndex = -1
  let pIndex = 0
  let sIndex = 0
  
  // 在 sIndex 小于 sLen 下
  while(sIndex < sLen) {
    // p仍有字符 pIdex < pLen, 且 p[pIndex] === s[sIndex] || p[pIndex] === '?'
    if (pIndex < pLen && [s[sIndex], '?'].includes(p[pIndex])) {
      //   sIndex,pIndex都进一位
      sIndex += 1
      pIndex += 1
    }
    // p仍有字符 pIdex < pLen, 且 p[pIndex] === '*'
    else if (pIndex < pLen && p[pIndex] === '*'){
      //   记录 starIndex = pIndex, sTempIndex = sIndex, 
      //   首先尝试星号匹配0字符的情况，故只pIndex 进一
      starIndex = pIndex
      sTempIndex = sIndex
      pIndex += 1
    }
    // 当pattern 和 string 不匹配了，
    // 或者 pattern的字符已用完并且没有星号（或句话pattern匹配完了，string都还有剩余）
    else if (starIndex < 0) {
      //   匹配失败，false
      return false
    }
    // 当pattern 和 string 不匹配了，或者 pattern的字符已用完前面有星号
    else {
      //   pIndex, sIndex 回溯，返回到记录的下一位，即 pIndex = starIndex + 1 ,sIndex = sTempIndex + 1
      //   更新sTempIndex = sIndex
      pIndex = starIndex + 1
      sIndex = sTempIndex + 1
      sTempIndex = sIndex
    }
  }
  
  // 当pattern中剩余的字符都是星号，则匹配成功（没有剩余星号字符也是成功）
  let resStarCount = 0
  for (let i = pIndex; i < pLen; i ++) {
    if (p[i] === '*') resStarCount += 1
  }
  return resStarCount === (pLen - pIndex)
}

const res1 = isMatch("mississippi", "m??*ss*?i*pi") // false
const res2 = isMatch("abc", "abc?*") // false
const res3 = isMatch("abcddddaaf", "**a?**cd**aaf") // true
const res4 = isMatch("adcbdk", "*a*b?k") // true
console.log(res1)
console.log(res2)
console.log(res3)
console.log(res4)