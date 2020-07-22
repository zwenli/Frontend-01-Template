import {createElement, Text, Wrapper} from './createElement'
import {Timeline, Animation} from './animation'

class Carousel {
  // config
  constructor(config) {
    this.children = []
    this.attributes = new Map()
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
    const children = this.data.map(url => {
      const element = <img src={url}/>
      element.addEventListener('dragstart', event => event.preventDefault())
      return element
    })
    const root = <div class="carousel">
      { children }
    </div>
    let timer = null
    let position = 0
    let tl = new Timeline
    const linear = (t) => t
    // 每次移动两张
    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length
      let current = children[position]
      let next = children[nextPosition]
      
      tl.clear()
      tl.add(new Animation(
        current.style,
        'transform',
        - position * 100,
        - (position + 1) * 100,
        500,
        0,
        linear,
        v => `translateX(${v}%)`,
        ))
      tl.add(new Animation(
        next.style,
        'transform',
        (1 - nextPosition) * 100,
        - nextPosition * 100,
        500,
        0,
        linear,
        v => `translateX(${v}%)`,
      ))
      tl.start()
      // // 禁用transition，防止位移到起始位置时产生动画效果
      // current.style.transition = "none"
      // next.style.transition = "none"
      // // 起始位置
      // current.style.transform = `translateX(${- position * 100}%)`
      // next.style.transform = `translateX(${100 - nextPosition * 100}%)`
      
      // setTimeout(() => {
      //   // 为了transition的生效需要setTimeout，promise会出现和requestAnimationFrame类似的问题
      //   // 确定好起始位置之后，动画可以生效了
      //   current.style.transition = ""
      //   next.style.transition = ""
      //   // 终止位置
      //   current.style.transform = `translateX(${-100 - position * 100}%)`
      //   next.style.transform = `translateX(${- nextPosition * 100}%)`
        
      //   position = nextPosition;
      // }, 16) // 16为一帧的时间
      position = nextPosition
      timer = setTimeout(nextPic, 3000)
      
    }
    
    timer = setTimeout(nextPic, 3000)
    
    // 拖拽， 拖拽和轮播动画有冲突
    // root.addEventListener('mousedown', (event) => {
    //   timer && window.clearTimeout(timer)
    //   const startX = event.clientX
      
    //   const containerWidth = root.getBoundingClientRect().width
    //   const lastPosition = (position - 1 + this.data.length) % this.data.length
    //   const nextPosition = (position + 1) % this.data.length
    //   const current = children[position]
    //   const last = children[lastPosition]
    //   const next = children[nextPosition]
      
    //   current.style.transition = 'ease 0s'
    //   last.style.transition = 'ease 0s'
    //   next.style.transition = 'ease 0s'
      
    //   let move = event => {
    //     // console.log(event.clientX - startX, event.clientY - startY);
    //     current.style.transform = `translateX(${event.clientX - startX - position * containerWidth}px)`
    //     last.style.transform = `translateX(${event.clientX - startX - (lastPosition - 1) * containerWidth}px)`
    //     next.style.transform = `translateX(${event.clientX - startX - (nextPosition + 1) * containerWidth}px)`
    //   }
    //   let up = event => {
    //     // 根据偏移量，决定是保持不变，还是切换到上一张/下一张
    //     let offset = 0
    //     if (event.clientX - startX > containerWidth / 2) {
    //       offset = 1
    //     } else if (event.clientX - startX < - containerWidth / 2) {
    //       offset = -1
    //     }
        
    //     current.style.transition = ''
    //     last.style.transition = ''
    //     next.style.transition = ''
        
    //     current.style.transform = `translateX(${offset * containerWidth - position * containerWidth}px)`;
    //     last.style.transform = `translateX(${offset * containerWidth - (lastPosition - 1) * containerWidth}px)`;
    //     next.style.transform = `translateX(${offset * containerWidth - (nextPosition + 1) * containerWidth}px)`;
    //     // 确定当前位置
    //     position = (position + offset + this.data.length) % this.data.length;
    //     document.removeEventListener('mousemove', move)
    //     document.removeEventListener('mouseup', up)
        
    //     timer = setTimeout(nextPic, 3000)
    //   }
      
    //   document.addEventListener('mousemove', move)
    //   document.addEventListener('mouseup', up)
    // })
    
    return root
  }
  
  mountTo(parent) {
    this.render().mountTo(parent)
  }
}

const component = <Carousel data={[
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]} />
// const component = <Carousel />

component.mountTo(window.document.body)

console.log(component)
