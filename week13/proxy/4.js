let handlers = new Map()
// 存放已经reactve的对象
let reactivities = new Map()
// 存放依赖的全局的临时的数组
let useReactivities = []

function reactive(obj) {
  if (reactivities.has(obj)) {
    return reactivities.get(obj)
  }
  let proxy = new Proxy(obj, {
    get(obj, prop) {
      // console.log(obj, prop)
      // 在使用的时候收集依赖
      useReactivities.push([obj, prop])
      if (typeof obj[prop] === 'object') {
        // 非直接量，继续响应式化
        return reactive(obj[prop])
      }
      return obj[prop]
    },
    set(obj, prop, value) {
      // 对象赋值对象，需要将原本的hander转移到新对象上
      if (typeof obj[prop] === 'object' && typeof value === 'object') {
        if (handlers.has(obj[prop])) {
          handlers.set(value, handlers.get(obj[prop]))
          handlers.delete(obj[prop])
        }
      }
      obj[prop] = value
      
      // 查询是否存在handler
      if (handlers.has(obj) && handlers.get(obj).has(prop)) {
        for (let handler of handlers.get(obj).get(prop)) {
          handler()
        }
      }
      
      return obj[prop]
    },
    defineProperty(...args) {
      console.log(args)
      return Object.defineProperty(...args)
    }
  })
  
  reactivities.set(obj, proxy)
  // 防止嵌套reactive
  reactivities.set(proxy, proxy)
  return proxy
}

function effect(handler) {
  // console.log(handler)
  // 过程式的操作，用全局变量去收集依赖
  // 清空之前收集到的依赖
  useReactivities = []
  handler() // 先执行下handler，触发收集相关的依赖（get）
  // 执行完成后，将收集到的依赖处理下
  for (let reactivity of useReactivities) {
    let [obj, prop] = reactivity
    if (!handlers.has(obj)) {
      handlers.set(obj, new Map())
    }
    if (!handlers.get(obj).has(prop)) {
      handlers.get(obj).set(prop, [])
    }
    handlers.get(obj).get(prop).push(handler)
  }
}

let dummy = null
let object = {
  a: {
    x: 1,
  }
}

let proxy = reactive(object)

// 存在bug，当属性是对象属性时，会出问题，
// effect(() => dummy.a.x)
effect(() => dummy = proxy.a.x)

console.log(dummy)
proxy.a.x = 5
console.log(dummy)
proxy.a = {x: 8}// 这么设置之后，x改变会响应不到
console.log(dummy)
proxy.a.x = 3
console.log(dummy)
proxy.a.y = 5
console.log(dummy)