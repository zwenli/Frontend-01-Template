# 本周总结

## 编程语言通识

按语法分类

* 非形式语言
  * 中文，英文
* 形式语言（[乔姆斯基谱系](https://zh.wikipedia.org/wiki/%E4%B9%94%E5%A7%86%E6%96%AF%E5%9F%BA%E8%B0%B1%E7%B3%BB)）
  * 0型 无限制文法 （该类型的文法能够产生所有可被图灵机识别的语言。可被图灵机识别的语言是指能够使图灵机停机的字符串，这类语言又被称为递归可枚举语言）
  * 1型 上下文相关文法（αAβ -> αγβ）
  * 2型 上下文无相关文法( A -> γ ，上下文无关语言为大多数程序设计语言的语法提供了理论基础。)
  * 3型 正则文法（正则表达式，限制表达能。力这种文法要求产生式的左侧只能包含一个非终结符号，产生式的右侧只能是空串、一个终结符号或者一个终结符号后随一个非终结符号）

50年代编程语言启蒙发展

现代编程语言融合多种类型  
词法 (3型)  
语法（1型/2型？）  

### [产生式（BNF）](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form)

#### 语法

<符号> ::= <使用符号的表达式>

* 用尖括号扩起来的名称表示语法结构名
* 语法结构分为基础结构和需要用其他语法结构定义的复合结构体系
  * 基础结构称为终结符
  * 复合结构称为非终结符
* 引号和中间的字符表示终结符
* 可以有括号
* `*`表示重复多次（0-n）
* `|`表示或
* `+`表示至少一次（1-n）

例子：[四则运算产生式](./四则运算产生式.md)

#### 通过产生式理解乔姆斯基谱系

* 0型 无限制文法
  * ? ::= ? （等号左边允许多个非终结符）
* 1型 上下文相关文法
  * ? `<A>` ? ::= ? `<B>` ?
  * eg: "a" `<A>` "c" ::= "a" "x" "c"
* 2型 上下文无关文法
  * `<A>` ::= ? （等号左边只允许一个非终结符）
* 3型 正则文法
  * `<A>` ::= `<A>`? （正则左递归）

#### 其他产生式

EBNF ANBF

#### 现代语言的特例

#### 语言的分类

形式语言-用途

* 数据描述语言
  * HTML，XML，CSS，SQL，XMAL
* 编程语言
  * C，C++，Java，C#，Python，Ruby，Perl，Lisp，T-SQL，Clojure，Haskell，Javascript

形式语言-表达方式

* [声明式语言](https://en.wikipedia.org/wiki/Declarative_programming)
  * HTML，XML，SQL，Lisp，Clojure，Haskell
* [命令型语言](https://en.wikipedia.org/wiki/Imperative_programming)
  * C，C++，Java，C#，Python，Ruby，Perl，Javascript

### 图灵完备性

[图灵机](https://en.wikipedia.org/wiki/Turing_machine)：数学计算模型  
[图灵完备性](https://en.wikipedia.org/wiki/Turing_completeness)：编程语言能够模拟任何图灵机则称为图灵完备，现代编程语言必定是图灵完备的。

* 命令式---图灵机
  * goto
  * if 和 while
* 声明式---lambda
  * 递归

### 动态与静态

* 动态
  * 在用户的设备/在线服务器上
  * 产品实际运行时
  * Runtime
* 静态
  * 在程序员的设备上
  * 产品开发时
  * Compiletime

静态更安全，动态更方便程序员开发。

### 类型系统

* 动态类型系统和静态类型系统（声明的变量类型允许变化）
* 强类型和弱类型(有隐式转换为弱类型)
  * String + Number
  * String == Boolean
* 复合类型
  * 结构体（如Object）
  * 函数签名 (T1, T2) => T3 参数列表和返回值要符合，否则错误
* 子类型
  * [逆变与协变](https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html#%E4%B8%80%E4%B8%AA%E6%9C%89%E8%B6%A3%E7%9A%84%E9%97%AE%E9%A2%98)
    * 逆变：凡是能用`Function<Child>`的地方，都能用`Function<Parent>`
    * 协变：凡是能用`Array<Parent>`的地方，都能用`Array<Child>`

### 一般命令式编程语言

* Atom
  * Identifier
  * Literal
* Expression
  * Atom
  * Opratior
  * Punctuator
* Statement
  * Expression
  * Keyword
  * Punctuator
* Structure
  * Function
  * Class
  * Process
  * Namespace
  * ...
* Program
  * Program
  * Module
  * Package
  * Library

### 一些知识点

* 编程语言的自举：[https://www.cnblogs.com/lidyan/p/6727184.html](https://www.cnblogs.com/lidyan/p/6727184.html)
* 关于元编程：[https://www.zhihu.com/question/23856985](https://www.zhihu.com/question/23856985)

## Lexcial Grammar词法

ECMA 标准中有个定义

> Lexical Grammar  
> SourceCharacter ::= any Unicode code point

JavaScript的字符为所有的Unicode字符，所以有必要了解什么是Unicode

### String-Encoding字符编码

有几个概念可以先理解一下：

* 字符集：简单理解为[字符](https://en.wikipedia.org/wiki/Character_(computing))的一个集合
* [字符编码](https://en.wikipedia.org/wiki/Character_encoding)：在计算机中就是将字符编码成对应的进制数。
* code point: 一个字符对应一个码点

ASCII是字符编码的一种（很早的），现代的字符编码会兼容ASCII的，Unicode也是。需要注意的是Unicode只是个字符集，定义了`code point`，而UTF-8就是Unicode的一种实现方式，也就是字符编码。

Unicode可以从Block和Categories两个角度去理解。

PS：

1. Unicode支持中文，所以Javascript是可以用中文做变量的，但是*最佳实践*，变量用ASCII兼容的字符最佳，如果真要用中文，则转成Unicode码

字符编码

* ASCII
* [Unicode](https://www.fileformat.info/info/unicode/index.htm)
  * [UTF-8](https://zh.wikipedia.org/zh-hant/UTF-8)：一种针对Unicode的可变长度字符编码
  * UTF-16
* GB
  * GB2313
  * GBK(GB13000)
  * GB18030
* ISO-8859
* BIG5

### InputeElement

* Whitespace 空白
* LineTermintor 换行
* Comment 注释
* Token 词

上面三项没有实际意义，实际有意义的都是token

WhiteSpace ::  

* `<TAB>` 制表符tab  
* `<VT>`  纵向制表符  
* `<FF>`  
* `<SP>` 普通空格 用这个  
* `<NBSP>` no break space 处理排版的问题  
* `<ZWNBSP>`zero width no break space  (BOM, bit order mask)  
* `<USP>` 一些特殊空格  

I learned Java Script today.  
I learned Java`&nbsp;`Script today. // 排版的时候 Java 和 Script 不会断开

LineTerminator ::  

* `<LF>` line feed U+00A \n 用这个  
* `<CR>` CARRIAGE RETURN (CR) U+00D \r  
* `<LS>` 下面这两个不常用  
* `<PS>`  

Comment ::  

* MultiLineComment /* MultiLineComment */ 不允许嵌套注释  
* SingleLineComment // SingleLineComment 不允许有换行符  

Token（常规下） ::  

* Punctuator 符号
* keywords 关键字
* Identifier
  * 变量名 不能和关键字重合，特例：`get`,`undefined`全局不可改变量
  * 属性名 能和关键字重合，如`dom.class` 的`class`不会报错
* Literal 直接量
  
实际JavaScript的Token ::

* Punctuator
* NumericLiteral
* StringLiteral
* Template
* IdentifierName
  * Identifier (IdentifierName but not ReservedWord)
  * ReservedWord (IdentifierName but not Identifier)
    * Keyword
    * FutureReservedWord: enum
    * NullLiteral: null
    * BooleanLiteral: true, false

IdentifierName中是以字母、`_`、`$`开头，其中根据[UnicodeIDStart](https://unicode.org/reports/tr31/#Table_Lexical_Classes_for_Identifiers)的定义，其实中文也是符合ID_start的范围。

JavaScript这么划分InputElement（4个顶级输入元素），主要是除法`\`，`\=`和正则有语法冲突，还有templte语法

## Types

JavaScript的类型有：

* String
* Number
* Boolean
* Object
* Null
* Undefined
* Symbol

### String

* Character
* Encodeing
* Grammar

### String-Encoding

Unicode

注意在JavaScript中超过4位的Unicode码，用`fromCodePorint`，`codePointAt`的函数

### String-Grammar

字符串的语法有三种：

* 双引号字符串："abc"
* 单引号字符串：'abc'
* 模版字符串：\`abc\`

单引号字符串，双引号字符串为直接量

模版字符串StringTemplate需要单独拿出来：  
\`abc ${a1} def ${a2} xxx\`  
其实就等效于：'abc ' + a1 + ' def ' + a2 + ' xxx'

### Number

[IEEE 754-2008](https://en.wikipedia.org/wiki/IEEE_754-2008_revision) Double Float

* sign 符号位，占1位，0正1负
* exponent 指数位，占11位，表示次方数
* fraction 值，占52位

浮点数比较：Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON

Math.abs(1.3 + 1.1 - 2.4) < Number.EPSILON // false

其实浮点数都是有个最小精度问题，0.1 + 0.2 为什么不等于0.3 就是精度的问题了，换个角度想，两个数字之间的差值在最小精度之内就是可以理解为是相等的了。

大端-小端

### Number-Grammar

NumericLiteral(数字直接量)

* DecimalLiteral（十进制）
  * 0
  * `0.`
  * .2
  * 1e3
* BinaryIntegerLiteral（二进制）
  * 0b[0-1]+
* OctalIntegerLiteral（八进制）
  * 0o[0-7]+
* HexIntegerLiteral（十六进制）
  * 0x[0-9a-fA-F]+

一个简单的进制转换例子：`0o12 .toString(16)`

练习：

* safe integer
  * Number.MAX_SAFE_INTEGER.toString(16) // '1fffffffffffff'
* float compare
  * Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON

### Boolean

`true` and `false`

### Null

`null`

### Undefined

`undefined`

注意`undefined`不是关键字，只是一个变量，全局不可修改，如果有怕`undefined`变量被修改了，可以通过`void 0`获取undefined值（void 会将一个表达式返回成undefined）

一个可以证明undefined可以修改的例子：

```js
function foo() {
  var undefined = 1
  console.log(undefined)
}
foo() // 1
```

### Symbol

TODO

### Object

TODO

## 作业

### 本周作业

* 写一个正则表达式 匹配所有 Number 直接量

  答案:

  ```js
  const numLiteralReg = /^((((([0-9]|([1-9][0-9]+))\.?)|([0-9]|([1-9][0-9]+))?\.([0-9]|([1-9][0-9]+)))([eE]([0-9]|([1-9][0-9]+)))?)|(0[bB][01]+)|(0[oO][0-7]+)|(0[xX][0-9A-Fa-f]+))$/

  // test
  numLiteralReg.test('0') // true
  numLiteralReg.test('01') // fase
  numLiteralReg.test('10') // true
  numLiteralReg.test('10e') // false
  numLiteralReg.test('10e3') // true
  numLiteralReg.test('10.') // true
  numLiteralReg.test('10.e3') // true
  numLiteralReg.test('.03') // false
  numLiteralReg.test('1.3e3') // true
  numLiteralReg.test('0b10') //true
  numLiteralReg.test('0b12') // false
  numLiteralReg.test('0o07') // true
  numLiteralReg.test('0o08') // false
  numLiteralReg.test('0x0f') // true
  numLiteralReg.test('0xg') // false
  ```

  解析：

  > 整数的正则：`/^([0-9]|([1-9][0-9]+))\.?$/`  
  > 小数的正则：`/^[0-9]|([1-9][0-9]+))?\.([0-9]|([1-9][0-9]+)$/`  
  > 指数部分的正则：`/([eE]([0-9]|([1-9][0-9]+)))?/`  
  > 三部分结合一起就是十进制数的正则表达式了
  >
  > 二进制数的正则表达式：`/^0[bB][01]+$/`
  >
  > 八进制数的正则表达式：`/^0[oO][0-7]+$/`
  >
  > 十六进制数的正则表达式：`/^0[xX][0-9A-Fa-f]+$/`
  >
  > 4种进制数的正则结合一起即可匹配所有 Number 直接量

* 写一个 UTF-8 Encoding 的函数

  答案：

  ```js
  // UTF-8 Encoding函数
  function UTf8_encode(string) {
    // return Uint8Array
    const charArr = string.split('')
    const utf8Arr = charArr.reduce((arr, char) => {
      arr.push(...char_encode(char))
      return arr
    }, [])
    return new Uint8Array(utf8Arr)
  }
  // helper function
  function char_encode(char) {
    const codePoint = char.codePointAt(0)
    if (codePoint <= 127) {
      // 0x000000-0x00007f (0-127)
      return [codePoint]
    } else if (codePoint >= 182 && codePoint <= 2047){
      // 0x000080-0x0007FF (128-2047)
      // 110yyyyy 10zzzzzz
      const y = (codePoint >> 6) + 192
      const z = (codePoint & 0b111111) + 128
      return [y, z]
    } else if (codePoint >= 2048 && codePoint <= 65535 ) {
      // 0x000800-00FFFF (2048-65535)
      // 1110xxxx 10yyyyyy 10zzzzzz
      const x = (codePoint >> 12) + 224
      const y = (codePoint >> 6 & 0b111111) + 128
      const z = (codePoint & 0b111111) + 128
      return [x, y, z]
    } else if (codePoint >= 65536 && codePoint <= 1114111) {
      // 0x010000-0x10FFFF (65536-1114111)
      // 11110www 10xxxxxx 10yyyyyy 10zzzzzz
      const w = (codePoint >> 18) + 240
      const x = (codePoint >> 12 & 0b111111) + 128
      const y = (codePoint >> 6 & 0b111111) + 128
      const z = (codePoint & 0b111111) + 128
      return [w, x, y, z]
    }
    return []
  }

  // test
  var utf8decoder = new window.TextDecoder()
  var testStr = 'utf-8测试'

  utf8decoder.decode(UTf8_encode(testStr)) === testStr // true
  ```

  解析：

  > 需要去了解Unicode转UTF-8的[规则](https://zh.wikipedia.org/wiki/UTF-8#%E6%8F%8F%E8%BF%B0)

* 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

  答案：

  ```js
  DoubleStringReg = /([^"\\\n\r\u2008\u2009]|\u2028|\u2029|?:\\((['"\\bfnrtv]|[^'"\\bfnrtvux0-9\n\r\u2008\u2009])|u([0-9a-fA-F]{4}|\{[0-9a-fA-F]{1,6}\})|x[0-9a-fA-F]{2}|[\n\r\u2008\u2009]))*/

  SingleStringReg = /([^'\\\n\r\u2008\u2009]|\u2028|\u2029|?:\\((['"\\bfnrtv]|[^'"\\bfnrtvux0-9\n\r\u2008\u2009])|u([0-9a-fA-F]{4}|\{[0-9a-fA-F]{1,6}\})|x[0-9a-fA-F]{2}|[\n\r\u2008\u2009]))*/
  ```

  解析：
  > 以双引号字符串字符为例，产生式如下：
  >
  >> DoubleStringCharacter ::  
  >> SourceCharacter but not one of `"` or `\` or LineTerminator  
  >> `<LS>`  
  >> `<PS>`  
  >> `\` EscapeSequence  
  >> LineContinuation  
  >
  > 分别对应的正则：  
  > 1. `/[^"\\\n\r\u2008\u2009]/`  
  > 2. `/\u2028/`  
  > 3. `/\u2029/`  
  > 4. `/?:\\(['"\\bfnrtv]|[^'"\\bfnrtvux0-9\n\r\u2008\u2009])|(u([0-9a-fA-F]{4}|\{[0-9a-fA-F]{1,6}\}))|(x[0-9a-fA-F]{2})/`  
  > 5. `/?:\\[\n\r\u2008\u2009]/`  

### 随堂练习

* 编写带括号的四则运算产生式

  > 见文件[四则运算产生式](./四则运算产生式.md)

* 尽可能寻找你知道的计算机语言，尝试把它们分类

  > * 0型 无限制文法
  >    * C++
  > * 1型 上下文相关文法
  >   * VB
  >   * JavaScript
  > * 2型 上下文无相关文法
  >   * HTML
  >   * CSS
  >   * JSON
  >   * XML
  >   * Lua
  > * 3型 正则文法  
  >
  > 水平有限，没有接触更多语言
