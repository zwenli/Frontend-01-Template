import {createElement, Text, Wrapper} from './createElement'
import {Timeline, Animation} from './animation'
import { ease } from './cubicBezier'

import './tab-panel.css'

export class TabPanel {
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
  getAttribute(name) {
    return this[name]
  }
  // children
  appendChild(child) {
    this.children.push(child)
  }
  
  select(i) {
    for (let view of this.childrenViews) {
      view.style.display = 'none'
    }
    this.childrenViews[i].style.display = ''
    for (let view of this.titleViews) {
      view.classList.remove('selected')
    }
    this.titleViews[i].classList.add('selected')
  }
  
  render() {
    this.childrenViews = this.children.map(child => <div style="padding: 8px 16px; min-height: 300px;">{child}</div>)
    this.titleViews = this.children.map((child, i) => <span onClick={() => this.select(i)}>{child.getAttribute('title')}</span>)
    
    setTimeout(() => this.select(0), 16)
    
    return <div class="tab-panel">
      <h1>{this.titleViews}</h1>
      <div>
        {this.childrenViews}
      </div>
    </div>
  }
  
  mountTo(parent) {
    this.render().mountTo(parent)
  }
}