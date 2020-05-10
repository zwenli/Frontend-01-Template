  const set = new Set()
  
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
  
  var allObjects = {
    id: 'Realm',
    label: 'Realm',
    object: this,
    children: [],
    path: [],
  }
  
  function getIntrinsicObjectsData() {
    let data = {
      id: 'Realm',
      label: 'Realm',
      object: this,
      children: [],
      path: [],
    }
    for(let p of globalProperties) {
      let item = {}
      if (typeof this[p] === 'function') {
        item = {
          id: p + ':' + this[p].name,
          label: this[p].name,
          object: this[p],
          path: [p],
        }
      } else {
        item = {
          id: p + ':' + p,
          label: p,
          object: this[p],
          path: [p],
        }
      }
      item = getPropertyData(item)
      data.children.push(item)
    }
    return data
  }
  /**
   * current = {
   *  id: '',
   *  label: '',
   *  object: '',
   *  children: [],
   *  path: [],
   * }
   */
  function getPropertyData(current) {
    if (set.has(current.object)) {
      return current
    }
    set.add(current.object)
    if (current.label === 'Function') {
      debugger
    }
    current.children = []
    console.log(current.path.join('.'))
    for (let p of Object.getOwnPropertyNames(current.object)) {
      const descriptor = Object.getOwnPropertyDescriptor(current.object, p)
      if ( descriptor.hasOwnProperty('value')
        && ((descriptor.value != null && typeof descriptor.value === 'object') || typeof descriptor.value === 'function')
        && descriptor.value instanceof Object
      ) {
        let data = {
          path: current.path.concat([p]),
          object: descriptor.value,
        }
        data.id = data.path.join('.') + ':' + p
        data.label = p
        data = getPropertyData(data)
        current.children.push(data)
      }
      if (descriptor.hasOwnProperty('get') && typeof descriptor.get === 'function') {
        let data = {
          path: current.path.concat([p]),
          object: descriptor.get,
        }
        const label = descriptor.get.name ? descriptor.get.name : 'get ' + p
        data.id = data.path.join('.') + ':' + label
        data.label = label
        data = getPropertyData(data)
        current.children.push(data)
      }
      if (descriptor.hasOwnProperty('set') && typeof descriptor.set === 'function') {
        let data = {
          path: current.path.concat([p]),
          object: descriptor.set,
        }
        const label = descriptor.set.name ? descriptor.set.name : 'set ' + p
        data.id = data.path.join('.') + ':' + label
        data.label = label
        data = getPropertyData(data)
        current.children.push(data)
      }
    }
    return current
  }
  
  // var data = getIntrinsicObjectsData()
