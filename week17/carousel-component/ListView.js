import {createElement, Text, Wrapper} from './createElement'
import {Timeline, Animation} from './animation'
import { ease } from './cubicBezier'

export class ListView {
  // config
  constructor(config) {
    this.children = []
    this.attributes = new Map()
    // this.properties = new Map()
    // this.root = document.createElement('div')
  }

  // attribute
  setAttribute(name, value) {
    this.attributes.set(name, value)
    this[name] = value
  }
  // children
  appendChild(child) {
    this.children.push(child)
  }
  
  render() {
    const data = this.data
    // children第一个为模版函数
    const template = this.children[0]
    return <div class="list-view">{
      data.map(template)
    }</div>
  }
  
  mountTo(parent) {
    this.render().mountTo(parent)
  }
}