// let element = document.body

function enableGusture(element) {
  const contexts = Object.create(null)
  const MOUSE_SYMBOL = Symbol('mouse')

  if (document.ontouchstart !== null) {
    element.addEventListener('mousedown', (event) => {
      contexts[MOUSE_SYMBOL] = Object.create(null)
      start(event, contexts[MOUSE_SYMBOL])
      const mousemove = (event) => {
        move(event, contexts[MOUSE_SYMBOL])
      }
      const mouseend = (event) => {
        end(event, contexts[MOUSE_SYMBOL])
        element.removeEventListener('mousemove', mousemove)
        element.removeEventListener('mouseup', mouseend)
      }
      element.addEventListener('mousemove', mousemove)
      element.addEventListener('mouseup', mouseend)
    })
  }


  element.addEventListener('touchstart', (event, context) => {
    // 多指触控
    for (touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null)
      start(touch, contexts[touch.identifier])
    }
  })

  element.addEventListener('touchmove', (event, context) => {
    for (touch of event.changedTouches) {
      move(touch, contexts[touch.identifier])
    }
  })

  element.addEventListener('touchend', (event, context) => {
    for (touch of event.changedTouches) {
      end(touch, contexts[touch.identifier])
      delete contexts[touch.identifier]
    }
  })

  // 打断touch事件会产生cancel事件，如touch中alert，触发系统手势等
  element.addEventListener('touchcancel', (event, context) => {
    for (touch of event.changedTouches) {
      cancel(touch, contexts[touch.identifier])
      delete contexts[touch.identifier]
    }
  })

  /**
   * 手势
   * 
   * tap
   * pan：panstart-panmove-panend
   * flick
   * press：pressstart-pressend
   * 
   */

  const start = (point, context) => {
    element.dispatchEvent(new CustomEvent('start', {
      detail: {
        startX: point.clientX,
        startY: point.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
      },
    }))
    context.startX = point.clientX
    context.startY = point.clientY
    context.moves = []
    context.isTap = true
    context.isPan = false
    context.isPress = false
    context.timeoutHandler = setTimeout(() => {
      if (context.isPan) {
        return
      }
      context.isTap = false
      context.isPan = false
      context.isPress = true
      // console.log('pressstart')
      element.dispatchEvent(new CustomEvent('pressstart'), {})
    }, 500);
  }

  const move = (point, context) => {
    let dx = point.clientX - context.startX
    let dy = point.clientY - context.startY
    
    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress) {
        // console.log('presscancel')
        element.dispatchEvent(new CustomEvent('presscancel', {}))
      }
      context.isTap = false
      context.isPan = true
      context.isPress = false
      // console.log('padstart')
      element.dispatchEvent(new CustomEvent('panstart', {
        detail: {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
        },
      }))
    }
    
    if (context.isPan) {
      const now = Date.now()
      context.moves.push({
        dx, dy,
        t: now,
      })
      // 保留300ms以内的记录
      context.moves = context.moves.filter(record => now - record.t < 300)
      // console.log('pan')
      element.dispatchEvent(new CustomEvent('pan', {
        detail: {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
        },
      }))
    }
  }

  const end = (point, context) => {
    if (context.isPan) {
      let dx = point.clientX - context.startX
      let dy = point.clientY - context.startY
      const record = context.moves[0]
      const speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t)
      const isFlick = speed > 2.5
      if (isFlick) {
        // console.log('flick')
        element.dispatchEvent(new CustomEvent('flick', {
          detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            speed,
          }
        }))
      }
      // console.log('padend')
      element.dispatchEvent(new CustomEvent('padend', {
        detail: {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed,
          isFlick,
        },
      }))
    }
    if (context.isPress) {
      // console.log('pressend')
      element.dispatchEvent(new CustomEvent('pressend', {}))
    }
    if (context.isTap) {
      // console.log('tap')
      element.dispatchEvent(new CustomEvent('tap', {}))
    }
    clearTimeout(context.timeoutHandler)
  }
  // 鼠标是没有cancel事件的
  const cancel = (point, context) => {
    // console.log('cancel')
    element.dispatchEvent(new CustomEvent('cancel', {}))
    clearTimeout(context.timeoutHandler)
  }
  // setTimeout(() => {
  //   alert(1)
  // }, 3000)
}
