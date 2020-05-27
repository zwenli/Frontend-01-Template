const images = require('images')

function render(viewport, element) {
  console.log('render start')
  if (element.style) {
    let img = images(element.style.width, element.style.height)
    let color = element.style.backgroundColor || 'rgb(0,0,0)'
    color.match(/rgb\((\d+),(\d+),(\d+)\)/)
    img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3))
    viewport.draw(img, element.style.left || 0, element.style.top || 0)
  }
  if (element.children) {
    for (let child of element.children) {
      render(viewport, child)
    }
  }
}

module.exports = render