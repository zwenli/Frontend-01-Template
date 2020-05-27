## CSS

CSS2.1
https://www.w3.org/TR/2011/REC-CSS2-20110607/

rem, vw, em, px,

http://www.html-js.com/article/2402
兼容方案：推荐vw

### 语法

[CSS2.1](https://www.w3.org/TR/CSS21/grammar.html#q25.0)

### 总体结构

* @charset
* @import
* rules
  * @media
  * @page
  * rule

### CSS规则的结构

* At-rules
  * @namespace
  * @page
  * @document
  * @charset
  * @media
  * @font-face
  * @import
  * @supports
  * @keyframes
  * @counter-style
  * @viewport
* relu
  * selector
    * selector_group
    * combinator
    * simple_selector
      * type： tagName
      * *： 通用
      * #： id
      * .： class
      * []： 属性
      * `:`： 伪类
      * `::`： 伪元素
  * key
    * properties
    * variables
  * Value

```css

/* simple_selector_sequence */
div#id.cls.cls2:visited::first-letter:not(.cls3)

```