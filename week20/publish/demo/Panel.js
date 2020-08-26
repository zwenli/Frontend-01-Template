import {createElement, Text, Wrapper} from './createElement'
import {Timeline, Animation} from './animation'
import { ease } from './cubicBezier'

export class Panel {
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
    return <div class="panel" style="width: 300px; border: solid 1px lightgreen; border-radius: 4px;">
      <h1 style="background-color: lightgreen; margin: 0; padding: 8px 16px;">{this.title}</h1>
      <div style="padding: 8px 16px; min-height: 300px;">{this.children}</div>
    </div>
  }
  
  mountTo(parent) {
    this.render().mountTo(parent)
  }
}