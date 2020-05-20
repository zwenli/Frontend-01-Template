# 本周总结

## 有限状态机FSM

* 每一个状态都是一个机器
  * 在每一个机器里，我们可以做计算、存储、输出。。。
  * 所有的这些机器接受的输入是一致的
  * 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数（无副作用）
* 每一个机器知道下一个状态
  * 每个机器都有确定的下一个状态（Moore）
  * 每个机器根据输入决定下一个状态（Mealy）

### 参考资料

[wiki](https://en.wikipedia.org/wiki/Finite-state_machine)

FSM的逻辑：FSM的下一个状态和输出是由输入和当前状态决定的。

有两种类型

* [Moore机](https://en.wikipedia.org/wiki/Moore_machine)：输出只依赖于状态
* [Mealy机](https://en.wikipedia.org/wiki/Mealy_machine)：输出依赖于输入和状态，（常用这种）

## HTML解析

用FSM来实现HTML的解析

PS：HTML标准中已给出[状态机的实现](https://html.spec.whatwg.org/multipage/parsing.html#tokenization)

## CSS解析

依赖

```
npm install css
```

## 作业

* 挑战题：我们如何用状态机处理完全未知的 pattern（选做）

  > TODO

* 跟上课堂内容，完成 DOM 树构建

  > [parser.js](./toy-browser/parser.js)

* 实现复合选择器，实现支持空格的 Class 选择器（选做）

  > TODO
