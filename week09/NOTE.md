# 本周总结

## animation 动画

* @keyframes定义
* animation：使用

```css
@keyframes mykf {
  from {
    background: red;
  }
  to {
    background: yellow;
  }
}
div {
  animation: mykf 5s infinite;
}
```

### animation 属性

* animation-name 时间曲线
* animation-duration 动画的时常(s,ms)
* animation-timing-function 动画的时间曲线
  * cubic-bezier(p1, p2, p3, p4) 三次贝塞尔曲线
  * linear = cubic-bezier(0.0, 0.0, 1.0, 1.0)
  * ease = cubic-bezier(0.25, 0.1, 0.25, 1.0) 推荐使用
* animation-delay 动画开始前的延时
  * 0 立即
  * `>0` 延后
  * `<0` 动画将立即开始，但将从动画序列开始x秒
* animation-iteration-count 动画的播放次数
  * infinite 无限循环
  * number 指定次数，可以为小数
* animation-direction 动画的播放方向（正放/倒放）
  * normal 正放
  * reverse 倒放
  * alternate 正放-倒放轮流
  * alternate-reverse 倒放-正放轮流
* animation-fill-mode 设置CSS动画在执行之前和之后如何将样式应用于其目标。
  * none 当动画未执行时，动画将不会将任何样式应用于目标，而是已经赋予给该元素的 CSS 规则来显示该元素。这是默认值。
  * forwards | backwards | both
* animation-paly-state 动画播放暂停
  * running
  * paused

```
<single-animation> = <time> || <timing-function> || <time> || <single-animation-iteration-count> || <single-animation-direction> || <single-animation-fill-mode> || <single-animation-play-state> || [ none | <keyframes-name> ]
```

### @keyframs

```css
/* 关键帧 */
@keyframes name1 {
  from {/* key: value*/}
  to {}
}
/* 0% = from，100% = to，不推荐混用 */
@keyframes name2 {
  0% {}
  25% {}
  50% {}
  100% {}
}
```

## transition

* transition-property 要变换的属性
* transition-duration 变化的时长
* transition-timing-function 时间曲线
* transition-delay 延迟

### cubic-bezier 三次贝塞尔曲线

n个点控制（n-1）阶贝塞尔曲线

一次贝塞尔曲线
二次贝塞尔曲线
三次贝塞尔曲线

参考资料：

* [贝塞尔曲线](https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A)
* [线性插值](https://zh.wikipedia.org/wiki/%E7%BA%BF%E6%80%A7%E6%8F%92%E5%80%BC)
* [怎么理解贝塞尔曲线？](https://www.zhihu.com/question/29565629)
* [https://cubic-bezier.com/](https://cubic-bezier.com/)

## 渲染

shape and color

形状和颜色

### 颜色

#### CMYK与RGB

三基色、三原色

三原色一般指的是红、绿、蓝三种，简称RGB，这是加色系。就是光源只含有特定的波段，本身就是色光，将不同颜色的光加在一起形成新的颜色。典型的例子是显示屏。(加色系)为什么是这三种颜色呢？这跟人类的视神经系统相关，人类的视觉神经分别有对红、绿、蓝三种颜色敏感的类型。

三基色一般指的是颜料三原色，在纯白光照射下颜色为绛红、黄、青，简称CMYK，属于减色系。它们本身不发光，靠反光被看见。由于材料吸收特定波段的光，所以只有不被吸收的部分反射了回来。加上的颜色越多吸收的光也越多。之所以有K（黑色颜料），是因为仅靠堆叠CMY三色，吸收的光线不够多，人眼会判断为灰色。要叠加到变成纯黑过于浪费颜料，所以人为添加了一种全波段吸收率极强的颜料作为黑色。(减色系)

#### HSL与HSV

Hue：色相，就是平常所说的颜色名称，如红色、黄色等，360度
Saturation：饱和度，是指色彩的纯度，越高色彩越纯，低则逐渐变灰，取0-100%的数值。
Lightness：亮度
Value：明度

参考资料

* [HSL和HSV](https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4)

### 形状

* border
* box-shadow
* border-radius

矢量图的通用解决方案：`data uri + svg`

boder回归本质，不去画形状

#### 矢量图与位图，svg与canvas

* svg是基于xml画的矢量图vector
* canvas是用javascript绘制图形，位图Bitmap

参考资料

* [SVG 教程](https://www.w3school.com.cn/svg/index.asp)
* [When to Use SVG vs. When to Use Canvas](https://css-tricks.com/when-to-use-svg-vs-when-to-use-canvas/)
* [WebGL 理论基础](https://webglfundamentals.org/webgl/lessons/zh_cn/)
* [learn OpenGL](https://learnopengl-cn.github.io/)

## 重学HTML

### HTML定义

HTML的定义：XML与SGML

#### DTD与XML namespace

* [https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd](https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)
* [http://www.w3.org/1999/xhtml](http://www.w3.org/1999/xhtml)

### HTML语义

语义化标签在于用对，不在于用得多，

#### 合法元素

* Element: `<tegname>...</tagname>`
* Text: text
* Comment: `<!-- comments -->`
* DocumentType: `<!Doctype html>`
* ProcessingInstruction: `<?a 1?>`
* CDATA: `<![CADA[]]>`

#### 字符引用

* `&#161;`&#161;
* `&amp;`&amp;
* `&lt;`&lt;
* `&gt;`&gt;
* `&quot;`&quot;
* `&apos;`&apos;

special 内的需要记起来

## 重学DOM

DOM

* DOM Tree
* Events
* Range

DOM树存的是Node

Node

* Element：元素型节点，跟标签相对应
  * HTMLElement
  * SVGElement
* Document：文档根节点
* CharachterData：字符数据
  * Text：文本节点
    * CDATASecrion：CDATA节点
  * Comment：注释
  * ProcessingInstruction：处理信息
* DocumentFragment：文档片段
* DocumentType：

### 导航类操作

* parentNode
* childNodes
* firstChild
* lastChild
* nextSibling
* previousSibling

living collection

--- element版本

* parentElement: 其实父节点只能是element，parentElement === parentNode
* children
* firstElementChild
* lastElementChild
* nextElementSibling
* previousElementSibling

伪元素不会出现在DOM树上，伪元素是在computeCss阶段生成的

### 修改操作

* appendChild：挪过去更贴切
* insertBefore：
* removeChild
* replaceChild

操作DOM的时候，节点只允许只有一个父节点，当节点插到别的节点上，会自动移除，在插入

### 高级操作

* compareDocumentPosition：是一个用于比较两个节点中关系的函数。
* contains：检查一个节点是否包含另一个节点的函数。
* isEqualNode：检查两个节点是否完全相等。
* isSameNode：检查两个节点是否是同一个节点，实际上在javascript中可以用“===”
* cloneNode：复制节点
  
### Event

EventTarget.addEventListener  
[https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

从外往里捕获，从里往外冒泡。先捕获再冒泡  
`<!-- 捕获定位，冒泡传递消息 -->`

Browser API

* DOM
  * DOM Tree
  * Events
  * Range
* CSSOM
* BOM
* Web Animation
* Cypto

## 本周作业

* 实践：为 wiki 编写 HTML

  > [wiki.html](./examples/wiki.html)

* 打开一个空白页面，找到它的 body，把它的 ComputedStyle 取出来，会得到大概 280 个属性。把这些属性进行归类，用脑图的方式写到学习总结里。（作业描述具体参考第 1 节视频最后的内容）

  > [css property.xmind](./css%20property.xmind)
