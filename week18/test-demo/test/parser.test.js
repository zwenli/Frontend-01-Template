import { parseHTML } from '../src/parser'
import assert from 'assert'

describe('test parserHTML', () =>{
  it('parse a single element', () => {
    let doc = parseHTML('<div></div>')
    let div = doc.children[0]
    // console.log(div)
    assert.equal(div.type, 'element')
    assert.equal(div.tagName, 'div')
    assert.equal(div.children.length, 0)
    assert.equal(div.attributes.length, 2)
  })
  
  it('parse a single element with text content', () => {
    let doc = parseHTML('<div>hello</div>')
    let div = doc.children[0]
    let text = div.children[0]
    // assert.equal(div.type, 'element')
    // assert.equal(div.tagName, 'div')
    // assert.equal(div.children.length, 1)
    assert.equal(text.type, 'text')
    assert.equal(text.content, 'hello')
  })
  
  it('tag mismatch', () => {
    try {
      let doc = parseHTML('<div></divs>')
    } catch (err) {
      assert.equal(err.message, 'Tag start end doesn\'t match!')
    }
  })
  
  it('text with <', () => {
    let doc = parseHTML('<div>a < b</div>')
    let text = doc.children[0].children[0]
    
    assert.equal(text.type, 'text')
    assert.equal(text.content, 'a < b')
  })
  
  it('with property', () => {
    let doc = parseHTML('<div id=a class=\'cls\' required data="abc"></div>')
    let div = doc.children[0]
    let count = 0
    for (let attr of div.attributes) {
      if (attr.name === 'id') {
        count += 1
        assert.equal(attr.value, 'a')
      }
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, 'cls')
      }
      if (attr.name === 'data') {
        count += 1
        assert.equal(attr.value, 'abc')
      }
      if (attr.name === 'required') {
        count += 1
        assert.equal(attr.value, '')
      }
    }
    assert.equal(count, 4)
  })
  it('unquoted attribute', () => {
    let doc = parseHTML('<div id=a></div>')
    let div = doc.children[0]
    let count = 0
    for (let attr of div.attributes) {
      if (attr.name === 'id') {
        count += 1
        assert.equal(attr.value, 'a')
      }
    }
    assert.equal(count, 1)
  })
  
  it('selfclose tag', () => {
    let doc = parseHTML('<img/>')
    let img = doc.children[0]
    for(let attr of img.attributes) {
      if (attr.name === 'isSelfClosing') {
        assert.equal(attr.value, true)
        return false
      }
    }
    assert.ok(false)
  })
  it('selfclose tag with double quoted attribute', () => {
    let doc = parseHTML('<img class="a"/>')
    let img = doc.children[0]
    let count = 0
    for(let attr of img.attributes) {
      if (attr.name === 'isSelfClosing') {
        count += 1
        assert.equal(attr.value, true)
      }
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, 'a')
      }
    }
    assert.equal(count, 2)
  })
  it('selfclose tag with single quoted attribute', () => {
    let doc = parseHTML('<img class=\'a\'/>')
    let img = doc.children[0]
    let count = 0
    for(let attr of img.attributes) {
      if (attr.name === 'isSelfClosing') {
        count += 1
        assert.equal(attr.value, true)
      }
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, 'a')
      }
    }
    assert.equal(count, 2)
  })
  it('selfclose tag with unquoted attribute', () => {
    let doc = parseHTML('<img class=a/>')
    let img = doc.children[0]
    let count = 0
    for(let attr of img.attributes) {
      if (attr.name === 'isSelfClosing') {
        count += 1
        assert.equal(attr.value, true)
      }
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, 'a')
      }
    }
    assert.equal(count, 2)
  })
  it('selfclose tag with no value attribute', () => {
    let doc = parseHTML('<img required/>')
    let img = doc.children[0]
    let count = 0
    for(let attr of img.attributes) {
      if (attr.name === 'isSelfClosing') {
        count += 1
        assert.equal(attr.value, true)
      }
      if (attr.name === 'required') {
        count += 1
        assert.equal(attr.value, '')
      }
    }
    assert.equal(count, 2)
  })
  it('selfclose tag less >', () => {
    try {
      let doc = parseHTML('<img/')
    } catch(err) {
      assert.equal(err.message, 'unexpected-solidus-in-tag parse error')
    }
  })
  
  it('script', () => {
    let content = `<div>abc</div>
      <span>xx</span>
      /script>
      <</</s<sc</scr</scri</scrip</script
      <
      </
      </s
      </sc
      </scr
      </scri
      </scrip
      </script`
    let doc = parseHTML(`<script>${content}</script>`)
    let script = doc.children[0]
    let text = script.children[0]
    assert.equal(text.type, 'text')
    assert.equal(text.content, content)
  })
})
