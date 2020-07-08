let handlers = new Map()
// 存放依赖的全局的临时的数组
let useReactivities = []

let object = {
  a: 1,
  b: 2,
}

function reactive(obj) {
  return new Proxy(obj, {
    get(obj, prop) {
      // console.log(obj, prop)
      // 在使用的时候收集依赖
      useReactivities.push([obj, prop])
      return obj[prop]
    },
    set(obj, prop, value) {
      // console.log(obj, prop, value
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

// let v12, v1, v2;

// let p1 = reactive({a: 1})
// let p2 = reactive({a: 2})

// effect(() => v12 = p1.a + p2.a)
// effect(() => v1 = p1.a)
// effect(() => v2 = p2.a)

// console.log(v12,v1,v2)

// p1.a = 3
// console.log(v12,v1,v2) // 5,3,2
// p2.a = 6
// console.log(v12,v1,v2) // 9,3,6

let dummy = null

let proxy = reactive(object)

// 存在bug，当属性是对象属性时，会出问题，
effect(() => dummy.a.x)
effect(() => dummy = proxy.a)

console.log(dummy)
proxy.a = 3
console.log(dummy)
