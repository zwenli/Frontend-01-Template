import {createElement, Text, Wrapper} from './createElement'
import {Timeline, Animation} from './animation'
import { ease } from './cubicBezier'

export class Carousel {
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
    let timer = null
    let position = 0
    let tl = new Timeline
    tl.start()
    
    
    const children = this.data.map((url, currentPosition) => {
      const transformReg = /translateX\(([\s\S]+)px\)/
      const lastPosition = (currentPosition - 1 + this.data.length) % this.data.length
      const nextPosition = (currentPosition + 1) % this.data.length
      let offset = 0
      let containerWidth
      const onStart = () => {
        clearTimeout(timer)
        tl.pause()
        let currentElement = children[currentPosition]
        containerWidth = currentElement.getBoundingClientRect().width
        let currentTransformValue = Number(currentElement.style.transform.match(transformReg)[1])
        offset = currentTransformValue + containerWidth * currentPosition
      }
      
      const onPan = (event) => {
        let currentElement = children[currentPosition]
        let lastElement = children[lastPosition]
        let nextElement = children[nextPosition]
        
        let dx = event.detail.clientX - event.detail.startX
        
        let currentTransformValue = - containerWidth * currentPosition + offset + dx
        let lastTransformValue = - containerWidth - containerWidth * lastPosition + offset + dx
        let nextTransformValue = containerWidth - containerWidth * nextPosition + offset + dx
        // console.log(lastTransformValue, currentTransformValue, nextTransformValue)
        
        currentElement.style.transform = `translateX(${currentTransformValue}px)`
        lastElement.style.transform = `translateX(${lastTransformValue}px)`
        nextElement.style.transform = `translateX(${nextTransformValue}px)`
      }
      const onPanend = (event) => {
        let direction = 0
        let dx = event.detail.clientX - event.detail.startX
        
        if (offset + dx > containerWidth / 2) {
          direction = 1
        } else if (offset + dx < - containerWidth / 2) {
          direction = -1
        }
        
        tl.reset()
        tl.start()
        
        let currentElement = children[currentPosition]
        let lastElement = children[lastPosition]
        let nextElement = children[nextPosition]
        
        let currentAnimation = new Animation(
          currentElement.style,
          'transform',
          - containerWidth * currentPosition + offset + dx,
          - containerWidth * currentPosition + direction * containerWidth,
          500,
          0,
          ease,
          v => `translateX(${v}px)`,
        )
        let lastAnimation = new Animation(
          lastElement.style,
          'transform',
          - containerWidth - containerWidth * lastPosition + offset + dx,
          - containerWidth - containerWidth * lastPosition + direction * containerWidth,
          500,
          0,
          ease,
          v => `translateX(${v}px)`,
        )
        let nextAnimation = new Animation(
          nextElement.style,
          'transform',
          containerWidth - containerWidth * nextPosition + offset + dx,
          containerWidth - containerWidth * nextPosition + direction * containerWidth,
          500,
          0,
          ease,
          v => `translateX(${v}px)`,
        )
        
        tl.add(currentAnimation)
        tl.add(lastAnimation)
        tl.add(nextAnimation)
        
        position = (position - direction + this.data.length) % this.data.length
        
        timer = setTimeout(nextPic, 3000)
      }
      
      const element = <img src={url} onStart={onStart} onPan={onPan} onPanend={onPanend} enableGusture={true}/>
      element.style.transform = 'translateX(0px)'
      element.addEventListener('dragstart', event => event.preventDefault())
      return element
    })
    
    const root = <div class="carousel">
      { children }
    </div>

    
    // 每次移动两张
    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length
      let current = children[position]
      let next = children[nextPosition]
      const containerWidth = current.getBoundingClientRect().width
      
      const currentAnimation = new Animation(
        current.style,
        'transform',
        - position * 100,
        - (position + 1) * 100,
        500,
        0,
        ease,
        v => `translateX(${containerWidth * v / 100}px)`,
      )
      const nextAnimation = new Animation(
        next.style,
        'transform',
        (1 - nextPosition) * 100,
        - nextPosition * 100,
        500,
        0,
        ease,
        v => `translateX(${containerWidth * v / 100}px)`,
      )
      tl.add(currentAnimation)
      tl.add(nextAnimation)

      position = nextPosition
      timer = setTimeout(nextPic, 3000)
    }
    
    timer = setTimeout(nextPic, 3000)
    return root
  }
  
  mountTo(parent) {
    this.render().mountTo(parent)
  }
}