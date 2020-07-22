export function createElement(cls, attributes, ...children) {
  let o
  if (typeof cls === 'string') {
    o = new Wrapper(cls)
  } else  {
    o = new cls({
      timer: {}
    })
  }
  if (attributes !== null) {
    Object.entries(attributes).forEach(([key, value]) => {
      o.setAttribute(key, value)
    })
  }
  
  let visit = (children) => {
    for(let child of children) {
      if (typeof child === 'object' && child instanceof Array) {
        visit(child)
        continue
      }
      if (typeof child === 'string') {
        child = new Text(child)
      }
      o.appendChild(child)
    }
  }
  visit(children)

  return o
}

export class Text {
  constructor(text) {
    this.children = []
    this.root = document.createTextNode(text)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
    for (let child of this.children) {
      child.mountTo(this.root)
    }
  }
}

export class Wrapper {
  constructor(type) {
    this.children = []
    this.root = document.createElement(type)
  }
  // attribute
  setAttribute(name, value) {
    // console.log('parent attribute', name, value)
    this.root.setAttribute(name, value)
  }
  
  get style() {
    return this.root.style
  }
  
  getBoundingClientRect() {
    return this.root.getBoundingClientRect()
  }
  // children
  appendChild(child) {
    this.children.push(child)
  }
  addEventListener(...args) {
    this.root.addEventListener(...args)
  }
  removeEventListener(...args) {
    this.root.removeEventListener(...args)
  }
  
  mountTo(parent) {
    parent.appendChild(this.root)
    for (let child of this.children) {
      child.mountTo(this.root)
    }
  }
}