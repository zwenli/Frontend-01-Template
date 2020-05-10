  const set = new Set()
  const queue = []
  const allObject = []
  const globalProperties = [
    'eval',
    'isFinite',
    'isNaN',
    'parseFloat',
    'parseInt',
    'decodeURI',
    'decodeURIComponent',
    'encodeURI',
    'encodeURIComponent',
    'Array',
    'Date',
    'RegExp',
    'Promise',
    'Proxy',
    'Map',
    'WeakMap',
    'Set',
    'WeakSet',
    'Function',
    'Boolean',
    'String',
    'Number',
    'Symbol',
    'Object',
    'Error',
    'EvalError',
    'RangeError',
    'ReferenceError',
    'SyntaxError',
    'TypeError',
    'URIError',
    'ArrayBuffer',
    'SharedArrayBuffer',
    'DataView',
    'Float32Array',
    'Float64Array',
    'Int8Array',
    'Int16Array',
    'Int32Array',
    'Uint8Array',
    'Uint16Array',
    'Uint32Array',
    'Uint8ClampedArray',
    'Atomics',
    'JSON',
    'Math',
    'Reflect',
  ]

  for (let p of globalProperties) {
    queue.push({
      path: [p],
      object: this[p]
    })
  }

  while (queue.length) {
    const current = queue.shift()
    
    if (set.has(current.object)) {
      continue;
    }
    set.add(current.object)
    allObject.push(current)
    console.log(current.path.join('.'))
    for (let p of Object.getOwnPropertyNames(current.object)) {
      const descriptor = Object.getOwnPropertyDescriptor(current.object, p)
      if ( descriptor.hasOwnProperty('value')
        && ((descriptor.value != null && typeof descriptor.value === 'object') || typeof descriptor.value === 'function')
        && descriptor.value instanceof Object
      ) {
        queue.push({
          path: current.path.concat([p]),
          object: descriptor.value
        })
      }
      if (descriptor.hasOwnProperty('get') && typeof descriptor.get === 'function') {
        debugger
        queue.push({
          path: current.path.concat([p]),
          object: descriptor.get
        })
      }
      if (descriptor.hasOwnProperty('set') && typeof descriptor.set === 'function') {
        queue.push({
          path: current.path.concat([p]),
          object: descriptor.set
        })
      }
    }
  }

  // const data = {
  //   id: 'Realm',
  //   children: [],
  // }
