# 本周总结

## 重学DOM

### Range API

[Range](https://developer.mozilla.org/zh-CN/docs/Web/API/Range)表示一个文档片段。批量，精细操作DOM树。  
Range API是DOM API的一部分

* var range = new Range()
* range.setStart(elment, 9)
* range.setEnd(element, 4)
* var range = document.getSelection().getRangeAt(0)

* range.setStartBefore
* range.SetEndBeofore
* range.setStartAfter
* range.setEndAfter
* range.selectNode
* range.selectNodeContents

* var fragment = range.extractContents()
* range.insertNode(document.createTextNode('abc'))

## CSSOM

document.styleSheets: 文档所有样式表

### Rules

* document.styleSheets[0].cssRules
* document.styleSheets[0].insertRule('p { color: pink; }', 0)：只接受文本
* document.styleSheets[0].removeRule(0)

### Rule

对应 at-rule

* CSSStyleRule
* CSSCharsetRule
* CSSImportRule
* CSSMdediaRule
* CSSFontFaceRule
* CSSPageRule
* CSSNamespaceRule
* CSSKeyframesRule
* CSSKeyframeRule
* CSSSupportsRule

* CSSStyleRule
  * selectorText text
  * style k-v结构

### getComputedStyle

* window.getComputedStyle(elt, pseudoElt);
  * elt: 想要获取的元素
  * pseudoElt 可选，伪元素

## CSSOM views

### 窗口API

* moveBy(x, y) 窗口移动到屏幕的特定坐标
* mobeTo(x, y) 窗口移动特定距离
* resizeBy(x, y) 差量
* resizeTo(x, y)
* window.open

### 视口滚动API

* window.scrollX
* window.scrollY

* window.scroll(x, y) 绝对值
* window.scrollBy(x, y) 差量

### 元素滚动API

* element.scrollLeft 表示 X 方向上的当前滚动距离
* element.scrollTop 表示 Y 方向上的当前滚动距离
* element.scrollWidth 表示元素内部的滚动内容的宽度
* element.scrollHeight 表示元素内部的滚动内容的高度

* element.scrollBy(x, y) 差量
* element.scrollTo(x, y) 绝对值
* element.scrollIntoView(arg)

* scroll事件

### 布局API

* window.innerHeight, window.innerWidth 视口的大小
* window.outerHeight, window.outerWidth 浏览器窗口占据的大小
* window.devicePixelRatio 物理像素和 CSS 像素单位的倍率关系
* window.screen （屏幕尺寸相关的信息）
  * window.screen.width, window.screen.height 设备的屏幕尺寸。
  * window.screen.availWidth, window.screen.availHeight
  * window.screen.colorDepth, window.screen.pixelDepth

#### 元素的布局信息

计算盒的实际位置

element.getClientRects  
会返回一个列表，里面包含元素对应的每一个盒所占据的客户端矩形区域，这里每一个矩形区域可以用 x, y, width, height 来获取它的位置和尺寸。

element.getBoundingClientRects  
这个 API 的设计更接近我们脑海中的元素盒的概念，它返回元素对应的所有盒的包裹的矩形区域，需要注意，这个 API 获取的区域会包括当 overflow 为 visible 时的子元素区域。

## 算法训练

## TicTacToe 井字棋

> 代码见[文件](./example/TicTacToe.html)

## 本周作业

* 把所有的 API 画进脑图里

  > [API.xmind](./API.xmind)

* 完成 TicTacToe 的练习

  > [TicTacToe.html](./example/TicTacToe.html)

* 自己完成一个五子棋的游戏编程

  > TODO
