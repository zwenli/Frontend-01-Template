var parser = require('./parser')
var path = require('path')

module.exports = function(source, map) { 
  let fileName = path.basename(this.resourcePath)
  let tree = parser.parseHTML(source)
  
  let template = null
  let script = null
  let style = null
  
  for (let node of tree.children) {
    if (node.tagName === 'template') {
      template = node.children.filter(e => e.type != 'text')[0]
    }
    if (node.tagName === 'script') {
      script = node.children[0].content
      console.log('----script----', script)
    }
    if (node.tagName === 'style') {
      style = node.children[0].content
    }
  }
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

if (!document.querySelector('head style[title="${fileName}"]')) {
  const style = document.createElement('style')
  style.title = '${fileName}'
  style.innerHTML = \`${style}\`
  document.head.appendChild(style)
}

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
  // console.log(r)
  return r
}