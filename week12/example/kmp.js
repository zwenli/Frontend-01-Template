// function stupidFind(source, pattern) {
//   for (let i = 0; i < source.length; i++) {
//     let matched = true
//     for (let j = 0; j < pattern.length; j++) {
//       if (source[i + j] !== pattern[j]) {
//         matched = false
//         break
//       }
//     }
//     if (matched) {
//       return true
//     }
//   }
//   return false
// }

function find(source, pattern) {
  const table = new Array(pattern.length).fill(0)
  let k = 0
  for (let j = 1; j < pattern.length; j++) {
    if (pattern[k] === pattern[j]) {
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
  
  let j = 0
  for (let i = 0; i < source.length; i++) {
    // let matched = true
    if (source[i] === pattern[j]) {
      j++
    } else if (j > 0) {
      j = table[j - 1]
      i--
    }
    if (j === pattern.length) return true
  }
  return false
}

console.log(find('abcabcabyyyy', 'abcaby'))