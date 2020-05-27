# 本周总结

## layout

排版（布局）：以flex实现

### 第一步 建立坐标轴

* flex-direction: row(行)

  ---------》main Axis 主轴  
  ｜  
  ｜  
  ｜  
  ⌄ cross axis 交叉轴

  main: width x left -> right
  cross: heigth y top -> bottom

* flex-direction: column(列)

  ---------》main Axis 交叉轴  
  ｜  
  ｜  
  ｜  
  ⌄ cross axis 主轴

  main: heigth y top -> bottom
  cross: width x left -> right

### 第二步 收集元素进行

* 根据主轴尺寸，把元素分进行
* 若设置了no-wrap，则强行分配进第一行

### 第三步 计算主轴

* 计算主轴方向
  * 找出所有flex元素
  * 把主轴方向的剩余尺寸按比例分配给这些元素
  * 若剩余尺寸为负，所有flex元素为0，等比压缩剩余元素

### 第四步 计算交叉轴

* 计算交叉轴方向
  * 根据每一行中最大元素尺寸计算行高
  * 根据行高flex-align和item-align，确性元素具体位置

### 参考资料

* [flex layout box model](https://www.w3.org/TR/2018/CR-css-flexbox-1-20181119/#box-model)
* [https://www.runoob.com/w3cnote/flex-grammar.html](https://www.runoob.com/w3cnote/flex-grammar.html)
* [https://github.com/spritejs/sprite-core/commit/8757b4d3888b4f237b1089e94e075ab58ca952a6#diff-677d382da9f8d81f61d50af24f937b32R32](https://github.com/spritejs/sprite-core/commit/8757b4d3888b4f237b1089e94e075ab58ca952a6#diff-677d382da9f8d81f61d50af24f937b32R32)

## render

渲染绘制实际会经历三个阶段：

1. render 渲染：浏览器中渲染这个过程，就是把每一个元素对应的盒变成位图。
2. compositing 合成：合成的过程，就是为一些元素创建一个“合成后的位图”（我们把它称为合成层），把一部分子元素渲染到合成的位图上面。
3. draw 绘制：绘制是把“位图最终绘制到屏幕上，变成肉眼可见的图像”的过程。

这里简化为视线draw步骤

### 第一步 绘制单个元素

* 绘制需要依赖一个图形环境
* 采用npm包images
* 绘制在一个viewport上进行（point）
* 与绘制相关的属性：background-color、border、background-image等

### 第二步 绘制DOM

* 递归调用子元素的绘制方法，完成DOM树的绘制
* 忽略一些不需要绘制的节点
* 实际浏览器中，文字绘制是难点，需要依赖字体库，这里忽略
* 实际浏览器中，还会对一些图层做compositing，这里忽略

参考：

* [freeType](https://www.freetype.org/)

### layout and render

CSS性能优化中的一些概念，简答理解为：

排版对应重排

渲染对应重绘

## css重学

### 语法

* [Grammar of CSS 2.1](https://www.w3.org/TR/2011/REC-CSS2-20110607/grammar.html#q25.0)
* [CSS Syntax Module Level 3](https://www.w3.org/TR/css-syntax-3/)

css的语法十分散乱，收集全十分麻烦，以CSS2.1学习下大体的（部分知识点已过时，参考学习就好）

#### 总体结构（CSS2.1）

* stylesheet
  * @charset
  * @import
  * rules
    * @media
    * @page
    * rule：这里就是我们熟悉的rule

### CSS规则的组成

* [At-rules](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule)
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
  * selector（[selector level 3](https://www.w3.org/TR/selectors-3/)、[selector level 4](https://www.w3.org/TR/selectors-4/)）
    * selector_group
      * selector_group ::=  selector [, selector]*
      * selector ::= simple_selector [combinator simple_selector]*
    * combinator
      * `+`
      * `>`
      * `~`
    * simple_selector
      * type： elementName
      * `*`： 通用
      * `#`： id
      * `.`： class
      * `[]`： 属性
      * `:`： 伪类
      * `::`： 伪元素
  * key
    * properties
    * [variables](https://www.w3.org/TR/css-variables/)
  * value

### CSS兼容性问题

[http://www.html-js.com/article/2402](http://www.html-js.com/article/2402)
兼容方案：推荐vw（当前）

兼容不在于方案，在于思路和方法。

## 本周作业

* 完成toy-browser

  > [layout.js](./toy-browser/layout.js)、[render.js](./toy-browser/render.js)

* 画一个 CSS 的脑图

  > [css.xmind](./css.xmind)

* 跟着课程跑一跑两个小实验程序

  > [css-snapshot.js](./scc-snapshot.js)、[css-crawler](./css-crawler.js)
