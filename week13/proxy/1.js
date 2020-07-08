let object = {
  a: 1,
  b: 2,
}

let proxy = new Proxy(object, {
  get(obj, prop) {
    console.log(obj, prop)
    return obj[prop]
  },
  defineProperty(...args) {
    console.log(args)
    return Object.defineProperty(...args)
  }
})


proxy.a = 2