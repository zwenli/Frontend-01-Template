let handlers = []

let object = {
  a: 1,
  b: 2,
}

function reactive(obj) {
  return new Proxy(object, {
    get(obj, prop) {
      console.log(obj, prop)
      return obj[prop]
    },
    set(obj, prop, value) {
      // console.log(obj, prop, value
      obj[prop] = value
      // 这里每次set都全部执行handler，是有非常大的优化空间，做依赖收集
      for (let handler of handlers) {
        handler()
      }
      
      return obj[prop]
    },
    defineProperty(...args) {
      console.log(args)
      return Object.defineProperty(...args)
    }
  })
}

function effect(handler) {
  console.log(handler)
  handler()
  handlers.push(handler)
}

let dummy = null

let proxy = reactive(object)

effect(() => dummy = proxy.a)

console.log(dummy)
proxy.a = 3
console.log(dummy)