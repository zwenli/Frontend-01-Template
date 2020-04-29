# 本周总结

## Expressions 表达式

两个方面理解

* Grammar 语法
  * Grammar Tree vs Priority（优先级）
  * Left hand side & Right hand side
* Runtime 运行时
  * Type Convertion 类型转换

### Expressions-Grammar

#### 语法树和运算符优先级

Tree vs Priority

* `+` `-`
* `*` `/`
* `(` `)`

知识点：

* 中序表达式
* 运算符优先级

#### MemberExpression

成员访问，表达式，ECMA262(2019)-P712

* `this`, `a`, ...
* `a[b]`
* `a.b`
* foo\`template\`
* super[b]
* super.b
* new.target
* new Foo, new Foo(), new Foo()[b], new Foo().b

知识点:

* new Foo() 的优先级 大于 new Foo
* 关于foo\`template\`  

  ```js
  var name = 'js'

  function foo() {
    console.log(arguments)
  }

  foo`Hello ${name}`
  // 会返回模版参数，根据这个特性可以写一些DSL
  ```

* new.target，可以判断该函数是否通过new调用

#### CallExpression

* foo()
* super()
* foo()['b']
* foo().b
* foo()\`abc\`

知识点：

* 函数括号里面有参数列表表达式Arguments P713
* super指父类对象

#### Left handside & Right handisde

a.b = c;
a + b = c;

#### UpdateExpression

自增/自减

* a [no LineTerminator here] ++
* a [no LineTerminator here] --
* ++ a
* -- a

知识点：

* ++ a ++ //会报错，正确应该加上括号：++ (a ++)
* a ++ 不能出现换行符，否则会出现不符合预期的情况

  ```js
  var a = 1, b = 1, c = 1
  
  a
  ++
  b
  ++
  c
  // 结果，a1,b2,c2
  
  a/*
  */++
  b/*
  */++
  c
  // 结果，a1,b3,c3
  ```

#### UnaryExpression

一元表达式

* delete a.b
* void foo() // 都会返回undefined,
* typeof a
* `+` a
* `-` a
* `~` a //按位取反
* `!` a // 非
* await a

知识点：

* 用void写立即执行函数，比加括号更好（括号会出现一些意外情况）
  
  ```js
  for (var i = 0; i < 10 ; i++) {
    var button = document.createElement('button')
    document.body.appendChild(button)
    button.innerText = i
    void function(i){
      button.onclick = function() {
        console.log(i)
      }
    }(i)
  }
  // 括号作为立即执行函数有时候分号插入有问题，
  ```
  
* `typeof null` // "object", javascript判断类型是十分蛋疼的

#### ExponentiationExpression

指数表达式（右结合）

* `**`
  * 2 `**` 3 `**` 4 = 2 `**` (3 `**` 4)

#### MultiplicativeExpression

乘法

* `*`
* `/`
* `%`

#### AdditiveExpression

加法

* `+`
* `-`

#### ShiftExpression

位移

* `<<`  向左移位
* `>>`  向右移位
* `>>>`  无符号向右移位

#### RelationalExpression

关系表达式

* `<`
* `>`
* `<=`
* `>=`
* `instanceof`
* `in`

#### EqualityExpression

* `==`
* `!=`
* `===`
* `!==`

#### BitwiseExpression

位运算

* `&`  按位与运算符
* `^`  按位异或运算符
* `|`  按位或运算符

#### LogicalExpression

* `&&`
* `||`

知识点：

* 短路逻辑：`&&`前一个为true，后面跳过不执行；`||`前一个为false，后面跳过不执行

#### ConditionalExpression

* `? :`

知识点：

* 可以连续嵌套实现多分支选择

### Type Convertion

类型转换

![type-convertion](./type-convertion.jpg)

#### Boxing

装箱转换

基本类型中Number，String，Symbol，Boolean在对象中都有对应的类。装箱转换就是将基本类型转换为对应的对象。注意Symbol无法使用new来调用。

知识点：

* `! ""`为`true`，`! new String("")`为`false`，new String是会生成对象，typeof上可看出
* `Number`，`String`，`Boolean`这三个对象如果不通过new调用返回对应的基本类型，new调用返回对象

#### Unboxing

拆箱转换

在 JavaScript 标准中，规定了 ToPrimitive 函数，它是对象类型到基本类型的转换（即，拆箱转换）。

对象到 String 和 Number 的转换都遵循“先拆箱再转换”的规则。通过拆箱转换，把对象变成基本类型，再从基本类型转换为对应的 String 或者 Number。

```js
1 + {} //'1[object Object]'
1 + {valueOf(){return 2}} // 3
1 + {toString(){return '3'}} // '13'
1 + {valueOf(){return 2}, toString(){return '3'}} // 先valueOf, 再toString
1 + {[Symbol.toPrimitive](){return 222}} // 有自定义toPrimitive，优先调用自定义的，否则调用默认的，默认先valueOf, 再toString

// 如果valueOf, toString都没有返回基本类型会报错TypeError
```

#### StringToNumber

#### NumberToString

## statement 语句

* Grammar 语法
  * 简单语句 ()
  * 复杂语句
  * 声明语句
* Runtime 运行时
  * Completion Record (ECMA-262,P44)
  * Leixcal Environment (ECMA-262,P79)

### Completion Record

Completion Record表示一个语句执行完成后的结果，有三个字段：

* [[type]] 表示完成的类型，有normal，break，continue,return,throw
* [[value]] 表示语句返回的值，符合`ECMAScript language value`，没有则返回`empty`
* [[target]] 表示语句的目标，通常是一个 JavaScript 标签。在普通语句中没什么作用，结合循环使用的。

### 简单语句

* ExpressionStatement
  * a = 1;
* EmptyStatement
  * ;
* DebuggerStatement
  * debugger
* ThrowStatement
  * throw \<Expression\>;
* ContinueStatement
  * continue;
  * continue label1;
* BreakStatement
  * break;
  * break label2;
* ReturnStatement
  * return;
  * return \<Expression\>;

### 复杂语句

* BlockStatement
* IfStatement
* SwitchStatement
* IterationStatement
* WithStatement
* LabelledStatement
* TryStatement

### BlockStatement

语句块

```
{
  statemementlist
}
```

BlockStament返回的Completion Record由里面的语句决定。如果里面的都是普通语句，则返回type为normal的Completion Record，如：

```js
{
  let a = 0; // normal empty empty
  a += 1; // normal 1 empty
  console.log(a); // normal empty empty
} // empty
```

如果statemementlist中有break,throw,continue,return这类语句，则会返回对应的Completion Record，并且不再执行后面的语句：

```js
{
  let a = 1; // normal empty empty
  return a; // return 1 empty
  a = a + 1;
  console.log(a);
} // return 1 empty
```

### IterationStatement

循环语句

* while(\<Expression\>) statement
* do statement while(\<Expression\>)
* for (decalation; expression; expression) statment
* for ( in ) // 遍历对象属性，数组会得出下标
* for ( of ) // 遍历具备迭代的对象 Symbol.iterator，数组会得出值
* for await ( of )

### 标签、循环、break、continue

* LabelledStatement
* IterationStatement
* ContinueStatement
* BreakStatement
* SwitchStatement

LabelledStatement 带标签语句

大部分时候，这个东西类似于注释，没有任何用处。唯一有作用的时候是：与完成记录类型中的 target 相配合，用于跳出多层循环。

```js
outer: while(true) {
  console.log('ounter') // 执行一次
  inter: while(true) {
    console.log('inter') // 执行一次
    break outer;
  }
}
console.log('complete')
```

break/continue 语句如果后跟了关键字，会产生带 target 的完成记录。一旦完成记录带了 target，那么只有拥有对应 label 的循环语句会消费它。

### TryStatement

```js
try {
  // 产生运行时错误，都会抛出异常 ExpressionStatement
  // throw
  // 1=a
} catch () {
  
} finally {
  
}
```

必须要花括号，不是block，会产生作用域

finally是十分特别的，try里面的语句执行完成后，必定会执行finally的语句。当两个都返回非normal类Completion Record，会出现奇特现象：

```js
function foo() {
  try {
    return 1
  } finally {
    return 2
  }
}
foo() // 2
```

try里的return语句执行了，但是没有立即返回，然后继续执行finally的return语句，产生return类Completion Record，终止执行。

### 声明语句

* FunctionDeclaration

  ```js
  function foo() {} // 函数声明

  var foo = function() {} // 函数表达式
  ```

* GeneratorDeclaration

  ```js
  function* foo() {
    yield 1
    yield 2
  }
  // var foo = function* {}
  ```

* AsyncFunctionDeclaration

  ```js
  async function foo() {
    await
  }
  ```

* AsyncGeneratorDeclaration

  ```js
  async function* foo() {
    yeild
    await
  }
  ```

* VariableStatement
  * `var`
* ClassDeclaration
  
  ```js
  class Cls1 {}

  // var Cls2 = class {}
  ```

* LexicalDeclaration
  * `const`
  * `let`

### 预处理

提升hositing，function and var

* 函数声明会进行预处理，即使函数申明放在调用语句之后，在执行之前就先声明了，不会报错可以正常访问
  
  ```js
  void function () {
    foo(); // 1
    function foo() {
      console.log(1);
    }
    /* 这样会报错
    {
      function foo() {
        console.log(1);
      }
    }
    */
  }();
  ```

* var变量声明会预处理，无块作用域，在执行代码之前会提升变量，但不赋值，初始为`undefined`，在声明之前访问不会报错。

  ```js
  void function() {
    console.log(a); // undefined
    {
      var a = 1;
    }
    console.log(a); // 1
  }();
  ```

* 函数声明提升优先于var变量声明
  
  ```js
  void function() {
    console.log(foo); // f foo
    var foo = 222
    console.log(foo); // 222
    function foo() {
      console.log(111)
    }
    // 函数声明优先提升，var变量遇到同名的函数声明就不提升了。
  }();
  ```

* `class`，`const`，`let`声明没有预处理，在声明之前访问会报错

PS: var 最好写在函数内最前面或变量第一次出现的地方

### 作用域

**作用域**是从语法上东西，表示是文本的作用范围，和运行时无关，即 上下文，闭包。指原代码，文本的范围。（静）  
**上下文**是指代码运行时，JavaScript引擎用的内存，存变量的地方。（动）

## Object

Object 在英文中表示世间万物，

任何一个对象都是唯一的，这与它本身的状态无关。
所以，即使状态完全一致的两个对象，也并不相等

我们用状态来描述对象。

我们**状态的改变**即是行为。

对象三要素：唯一性identifier，状态state，行为behavior

<!-- 面向对象：封装，继承，多态 -->

面向对象编程的范式:

* Object-Class

类是一种常见的描述对象的方式。

而“归类”和“分类”则是两个主要的流派。

对于“归类”方法而言，多继承是非常自然的事情。如C++

而采用分类思想的计算机语言，则是单继承结构，并且会有一个基类Object

mixin,interface 两个主要都是解决状态/行为的问题

* Object-Prototype

原型是一种更接近人类原始认知的描述对象的方法。

我们并不试图做严格的分类，而是采用“相似”这样的方式去描述对象。

任何对象仅仅需要描述它自己与原型的区别即可。 （找出一个典型的对象，说出它和典型对象的区别）

我们不应该收到语言描述的干扰。  
在设计对象的状态和行为时，我们总是遵循“行为改变状态”的原则。

### Object in JavaScript

Object 包含属性（property)和原型(prtotype)
Object是没有方法的概念，都是属性。
Object用属性来统一抽象对象状态和行为。

* Date Property (数据属性用于描述状态)
  * [[value]]
  * writable
  * enumerable
  * configurable
* Accessor Property（访问器属性用于描述行为，保守着用，基础库可用，业务少用/不用）
  * get
  * set
  * enumerable
  * configurable

### Object API/Grammar

* {} . [] Object.defineProperty
* Object.create (指定某个原型对象创建) / Object.setPrototypeOf / Object.getPrototypeOf （查看/修改原型对象）
* new / class / extends （基于类的面向对象编程）
* new / function / prototype （四不像机制，糅合类和原型）

前3中是很好的API， 2和3不要混用
4就不要用了。

### special object

* Function  
`[[call]]` Object具备`[[call]]`方法就是Function Object。Function Object 同时具备`[[Construct]]`，

* Array  
Array Object下标属性允许正负，有一个不可配置`[[length]]`属性，`length`会随着数组长度实时变化，当手动修改`length`的值，存在两种情况：
  * 1、值大于原数组长度，数组对应添加多出的`empty`;
  * 2、值小于原数组长度，数组会截断

* String  
String Object有一个不可配置且不可修改的`[[length]]`属性，手动修改`length`是不生效的，它始终等于字符串的长度。支持下标运算。

* Arguments Exotic Objects  
arguments对象的下标属性和对应的参数变量关联。有一个访问器属性`callee`，在非严格模式下调用会返回函数自身；严格模式下调用会报错。

* Integer-Indexed Exotic Objects  
类型数组对象

* Module Namespace Exotic Objects
Module Namespace Ojbects 和一般对象相差很大。

* Immutable Prototype Exotic Objects
has a [[Prototype]] internal slot that will not change once it is initialized.

## 作业

### 本周作业

* 补充写完函数 convertStringToNumber
* 补充写完函数函数 convertNumberToString

  > [答案](./expression.html)

* 找出 JavaScript 标准里有哪些对象是我们无法实现出来的，都有哪些特性？写一篇文章，放在学习总结里。

  > 见[Special Object](#special-object)
