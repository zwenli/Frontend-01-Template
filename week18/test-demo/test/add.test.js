import add from '../src/add.js'
import assert from 'assert'

describe('test add', () =>{
  it('add(3,4) shoud equal 7', () => {
    assert.equal(add(3,4), 7)
  })
})

// ava
// var add = require('../src/add.js')
// var assert = require('assert')
// import add from '../src/add.js'
// import test from 'ava'

// test('foo', t => {
//   if (add(3,4) === 7) {
//     t.pass()
//   }
// })