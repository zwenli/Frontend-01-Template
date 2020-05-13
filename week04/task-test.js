// async function async1() {
//   console.log('async 1 start');
//   await async2();
//   console.log('async 1 end');
// }

// async function async2() {
//   console.log('async 2');
// }

// async1();
// new Promise(function(resolve) {
//   console.log('promise1');
//   resolve();
// }).then(function() {
//   console.log('promise2');
// })


/**
 * async 1 start
 * async 2
 * promise1
 * async 1 end
 * promise2
 */

// function() {}

async function afoo() {
  console.log('1')
  
  await new Promise(resolve => resolve())
  
  console.log('2')
}

new Promise(resolve => resolve()).then(() => {
  console.log('3')
}).finally(() => {
  console.log('5')
})

setTimeout(function () {
  console.log('6')

  new Promise(resolve => resolve()).then(() => {
    console.log('7')
  })
}, 0)

console.log('8')
afoo()

/**
 * 第一个宏任务：
 *  8,1
 *    入队3,2
 *  3
 *    入队5
 *  2
 *  5
 * 第二个宏任务：
 *  6
 *    入队7
 *  7
 */
