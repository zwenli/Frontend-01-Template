## 盒创建 box generation

`display`指定盒的类型box's type。display的某些值使文档上的元素生成一个主体盒（principal box）。一些还会生成额外的box如‘list-item’。

## block-level element and black box

block-level element，以块级显示的元素，如段落，会生成block-level box。
`display`中的‘block’、'list-item'、'table'值可以事元素变成block-level。
Block-level boxes 参与在一个BFC（block formatting context）上。

In CSS 2.2, a block-level box is also a block container box unless it is a table box or the principal box of a replaced element.
block container box

block container elment

block-level box同时也是block container 被称为 block box。

## 匿名块级盒子

anonymous block box，

在块容器盒子里，既有行级内容和块级内容，会在行级内容生成一个匿名块级盒子。换句话说，如果一个block container box里面有一个block-level box，会强制里面内容只有block-level box.

在内联盒上inline box内包含一个 block-level box，则会在block-level周围生成两个anonymous block box.
eg:

```html
<body>
  <p style="display: inline; margin: 30px; background-color: aqua; border: 1px solid black;">
    This is anonymous text before the SPAN.
    <span style="display: block; margin: 30px; background-color: green;">This is the content of SPAN.</span>
    This is anonymous text after the SPAN.
  </p>
</body>
```

## inline-level element and inline box
