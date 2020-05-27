function getStyle(element) {
  if (!element.style) {
    element.style = {}
  }
  
  for (let prop in element.computedStyle) {
    const camelCaseProp = getCamelCaseProp(prop)
    element.style[camelCaseProp] = element.computedStyle[prop].value
    
    if (element.style[camelCaseProp].toString().match(/px$/)) {
      element.style[camelCaseProp] = parseInt(element.style[camelCaseProp])
    }
    if (element.style[camelCaseProp].toString().match(/^[0-9\.]+$/)) {
      element.style[camelCaseProp] = parseInt(element.style[camelCaseProp])
    }
  }
  return element.style
}

function getCamelCaseProp(prop) {
  let parts = prop.split('-')
  let str = ''
  parts.forEach((val, index) => {
    if (index) {
      str += val.charAt(0).toUpperCase() + val.slice(1)
    } else {
      str += val
    }
  })
  return str
}

/**
 * 
 */

function layout(element) {
  console.log('----layout------', element)
  
  if (!element.computedStyle) {
    return
  }
  let elementStyle = getStyle(element)
  
  // 只处理flex布局的
  if (elementStyle.display !== 'flex') {
    return
  }
  
  let items = element.children.filter(item => item.type === 'element')
  
  // order 排序
  items.sort((a, b) => (a.order || 0) - (b.order || 0))
  let style = elementStyle;
  
  // auto，空字符串处理成null方便判断
  ['width', 'height'].forEach((size) => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null
    }
  })
  
  // 默认值设置
  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row'
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap'
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start'
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems= 'stretch'
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent= 'stretch'
  }
  
  let mainSize, mainStart, mainEnd, mainSign, mainBase,
      crossSize, crossStart, crossEnd, crossSign, crossBase
  
  if (style.flexDirection === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1
    mainBase = 0
    
    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  } else if (style.flexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = element.width
    
    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  } else if (style.flexDirection === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = 1
    mainBase = 0
    
    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  } else if (style.flexDirection === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'bottom'
    mainEnd = 'top'
    mainSign = -1
    mainBase = style.height
    
    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }
  
  if (style.flexWrap === 'wrap-reverse') {
    let temp = crossStart
    crossStart = crossEnd
    crossEnd = temp
    crossSign = -1
  } else {
    crossSign = +1
    crossBase = 0
  }
  
  let isAutoMainSize = false
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0
    items.forEach((item) => {
      itemStyle = getStyle(item)
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
        elementStyle[mianSize] += itemStyle[mainSize]
      }
    })
    isAutoMainSize = true
  }
  
  
  // 收集元素进行
  let flexLine = []
  let flexLines = [flexLine]
  
  let mainSpace = style[mainSize]
  let crossSpace = 0
  
  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    let itemStyle = getStyle(item)
    
    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0
    }
    
    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      // TODO: 只需要判断flexWrap就好了吧
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(itemStyle[crossSize], crossSpace)
      }
      flexLine.push(item)
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        // 元素主轴尺寸不得超出容器主轴尺寸
        itemStyle[mainSize] = style[mainSize]
      }
      if (mainSpace < itemStyle[mainSize]) {
        // 剩余空间不足以存放元素，换新的一行
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        flexLine = [item]
        flexLines.push(flexLine)
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(item)
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(itemStyle[crossSize], crossSpace)
      }
      mainSpace -= itemStyle[mainSize]
    }
  }
  
  flexLine.mainSpace = mainSpace
  if (style.flexWrap === 'nowrap' && isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== (void 0)) ? style[crossSize] : crossSpace
  } else {
    flexLine.crossSpace = crossSpace
  }
  
  if (mainSpace < 0) {
    // 超出容器主轴尺寸，等比缩小所有元素
    const scale = style[mainSize] / (style[mainSize] - mainSpace)
    let currentMain = mainBase
    // for (let i = 0; i < items.length; i++) {
      // const item = items[i]
      // const itemStyle = getStyle(item)
      
      // if (itemStyle.flex) {
      //   itemStyle[mainSize] = 0
      // }
      // itemStyle[mainSize] = itemStyle[mainSize] * scale
      // itemStyle[mainStart] = currentMain
      // itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      // currentMain = itemStyle[mainEnd]
    // }
    items.forEach((item) => {
      const itemStyle = getStyle(item)
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale
      itemStyle[mainStart] = currentMain
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    })
  } else {
    flexLines.forEach((items) => {
      let mainSpace = items.mainSpace
      let flexTotal = 0
      for (let i = 0; i < items.length; i++) {
        const itemStyle = getStyle(items[i])
        if (itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
          total += itemStyle.flex
          continue
        }
      }
      
      if (flexTotal) {
        let currentMain = mainBase
        for (let i = 0; i < items.length; i++) {
          const itemStyle = getStyle(items[i])
          
          if (itemStyle.flex) {
            itemStyle[mainSize] = mainSpace / flexTotal * itemStyle.flex
          }
          
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd]
        }
      } else {
        // there is no flexible flex items, which means, justifyContent should work
        let currentMain, step
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase
          step = 0
        } else if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase
          step = 0
        } else if (style.justifyContent === 'center') {
          currentMain = mainSpace / 2 * mainSign + mainBase
          step = 0
        } else if (style.justifyContent === 'space-between') {
          step = mainSpace / (items.length - 1) * mianSize
          currentMain = mainBase
        } else if (style.justifyContent === 'space-around') {
          step = mainSpace / items.length * mianSize
          currentMain = step / 2 + mainBase
        }
        for (let i = 0; i < items.length; i++) {
          const itemStyle = getStyle(items[i])
          
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }
  
  // 计算交叉轴 , align-items, align-self
  // let crossSpace
  // 交叉轴剩余尺寸
  if (!style[crossSize]) {
    // auto sizing
    crossSpace = 0 
    elementStyle[crossSize] = 0
    // elementStyle[crossSize] = flexLines.reduce((total, cur) => (total += cur.crossSpace, total), 0)
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] += flexLines[i].crossSpace
    }
  } else {
    crossSpace = style[crossSize]
    for (var i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace
    }
  }
  
  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize]
  } else {
    crossBase = 0
  }
  
  // let lineSize = style[crossSize] / flexLines.length
  let step
  if (style.alignContent === 'flex-start') {
    crossBase += 0
    step = 0
  } else if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace
    step = 0
  } else if (style.alignContent === 'center') {
    crossBase += crossSign * crossSpace / 2
    step = 0
  } else if (style.alignContent === 'space-between') {
    crossBase += 0
    step = crossSpace / (flexLines.length - 1)
  } else if (style.alignContent === 'space-around') {
    step = crossSpace / flexLines.length
    crossBase += crossSign * step / 2
  } else if (style.alignContent === 'stretch') {
    step = 0
    crossBase += 0
  }
  flexLines.forEach((items) => {
    const lineCrossSize = style.alignContent === 'stretch' ?
      items.crossSpace + crossSpace / flexLines.length :
      items.crossSpace
    
    for (let i = 0; i < items.length; i++) {
      const itemStyle = getStyle(items[i])
      const align = itemStyle.alignSelf || style.alignItems
      
      if (itemStyle[crossSize] === null) {
        itemStyle[crossSize] = (align === 'stretch') ?
          lineCrossSize : 0
      }
      
      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }
      if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
      }
      if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }
      if (align === 'stretch') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : lineCrossSize)
        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
      }
    }
    crossBase += crossSign * (lineCrossSize + step)
  })
  
  console.log('layout: ', items)
  
}

module.exports = layout