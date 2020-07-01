function find(source, pattern) {
  const table = new Array(pattern.length).fill(0)
  let k = 0
  for (let j = 1; j < pattern.length; j++) {
    if (pattern[k] === pattern[j] || pattern[k] === '?') {
      k += 1
      table[j] = k
    } else if (k) {
      k = table[k - 1]
      j--
    } else {
      k = 0
      table[j] = k
    }
  } 
  // return table
  let i = 0
  let j = 0
  while (i < source.length && j < pattern.length) {
    // let matched = true
    if (source[i] === pattern[j] || pattern[j] === '?') {
      j++
      i++
    } else if (j > 0) {
      j = table[j - 1]
    }
  }
  if (j === pattern.length) return i - pattern.length
  return -1
}

const res1 = find('abcabcabyyyy', 'abcaby')
const res2 = find('abcabcabd', 'ab?abd')
console.log(res1)
console.log(res2)