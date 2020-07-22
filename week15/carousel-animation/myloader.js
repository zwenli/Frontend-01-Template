var parser = require('./parser')

module.exports = function(source, map) { 
  // console.log('-------loader  start-------')
  // console.log(source, this.resourcePath)
  // console.log(parser.parseHTML(source))
  // console.log('-------loader end-------')
  
  let tree = parser.parseHTML(source)
  // console.log(tree.children[1].children[0].content)
  
  let template = null
  let script = null
  
  for (let node of tree.children) {
    if (node.tagName === 'template') {
      template = node.children.filter(e => e.type != 'text')[0]
    }
    if (node.tagName === 'script') {
      script = node.children[0].content
    }
  }
  
  console.log(template)
  
  let visit = (node) => {
    if (node.type === 'text') {
      return JSON.stringify(node.content)
    }
    let attrs = {}
    for (let attribute of node.attributes) {
      attrs[attribute.name] = attribute.value
    }
    let children = node.children.map(node => visit(node))
    return `createElement('${node.tagName}', ${JSON.stringify(attrs)}, ${children})`
  }
  
  
  
  let r = `
import {createElement, Text, Wrapper} from './createElement'

export default class Carousel {
  setAttribute(name, value) {
    this.attributes.set(name, value)
    this[name] = value
  }
  appendChild(child) {
    this.children.push(child)
  }
  render() {
    return ${visit(template)}
  }
  mountTo(parent) {
    this.render().mountTo(parent)
  }
}
`
  console.log(r)
  return r
}