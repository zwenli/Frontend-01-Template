const css = require('css')

module.exports = function(source, map) {
  const stylesheet = css.parse(source)
  const name = this.resourcePath.match(/([^/]+).css$/)[1]
  for (let rule of stylesheet.stylesheet.rules) {
    rule.selectors = rule.selectors.map(selector =>
      selector.match(new RegExp(`.${name}`)) ? selector :
        `.${name} ${selector}`
    )
  }
  
  // console.log(css.stringify(stylesheet))
  return `
  const style = document.createElement('style')
  style.innerHTML = ${JSON.stringify(css.stringify(stylesheet))}
  document.head.appendChild(style)
  `
}