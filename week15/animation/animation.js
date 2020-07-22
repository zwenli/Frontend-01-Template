export class Timeline {
  constructor() {
    this.requestId = null
    this.animations = []
    this.startTime = null
    this.pauseTime = null
    this.state = 'inited'
    // 每帧执行的 函数
    // 相比定义在外面的函数，变量这里可以使用箭头函数，绑定了this值
    this.tick = () => {
      let t = Date.now() - this.startTime
      console.log(t)
      const animations = this.animations.filter(animation => !animation.finished)
      for (let animation of animations) {
        const {object, property, template, duration, delay, timingFunction, addTime} = animation
        let progression = timingFunction((t - delay - addTime) / duration) // 0-1
        // 如果动画已经播放完，进度强制改为1，确保结束的位置正确
        if (t > duration + delay + addTime) {
          progression = 1
          animation.finished = true
        }
        const value = animation.valueFromProgression(progression) // 根据progression计算实际值value
        object[property] = template(value)
      }
      // 所有动画都执行完成后就不必循环了
      if (animations.length) {
        this.requestId = requestAnimationFrame(this.tick)
      }
    }
  }
  start() {
    if (this.state !== 'inited') return;
    this.state = 'playing'
    this.startTime = Date.now()
    this.tick()
  }
  restart() {
    if (this.state === 'playing') {
      this.pause()
    }
    this.animations = [] // 为什么要清空？
    this.requestId = null
    this.state = 'playing'
    this.startTime = Date.now()
    this.pauseTime = null
    this.tick()
  }
  pause() {
    if (this.state !== 'playing') return;
    if (this.requestId !== null) {
      this.state = 'paused'
      this.pauseTime = Date.now()
      cancelAnimationFrame(this.requestId)
    }
  }
  resume() {
    if (this.state !== 'paused') return;
    // 加上暂停时长
    this.state = 'playing'
    this.startTime += Date.now() - this.pauseTime
    this.tick()
  }
  // 播放过程中允许插入animation, addTime 0为立即追上播放进度
  add(animation, addTime) {
    this.animations.push(animation)
    animation.finished = false
    if (this.state === 'playing') {
      animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime
    } else {
      animation.addTime = addTime !== void 0 ? addTime : 0
    }
  }
}

export class Animation {
  constructor(object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object
    this.property = property
    this.template = template
    this.start = start
    this.end = end
    this.duration = duration
    this.delay = delay
    this.timingFunction = timingFunction
  }
  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start)
  }
}

export class ColorAnimation {
  constructor(object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object
    this.property = property
    this.template = template || (v => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`)
    this.start = start
    this.end = end
    this.duration = duration
    this.delay = delay
    this.timingFunction = timingFunction
  }
  valueFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a),
    }
  }
}


/**
 * let animation = new Animation(object, property, start, edn, duration, delay, timingFunction)
 * let animation2 =  new Animation
 * 
 * let timeline = new Timeline
 * 
 * timeline.add(animation)
 * timeline.add(animation2)
 * 
 * timeline.start()
 * timeline.pause()
 * timeline.resume()
 * timeline.stop()
 * 
 * setTimeout
 * setInterval
 * requestAnimationFrame
 * 
 * 
 * animation.start()
 * animation.pause()
 * animation.resume()
 * animation.stop()
 * 多个animation去管理start,pause,resume,stop时难以控制，
 * 多个函数调用性能也不好，所以会引入时间线timeline,总体控制多个animation
 * 
 */
