# 本周总结

## 编程训练

### 使用LL算法构建AST

LL解析四则运算成AST

步骤：

* 分析四则运算中的token
  * `Number`,`whitespace`,`LineTerminator`,`+`,`-`,`*`,`/`,`(`,`)`
* 将四则运算字符串解析成token[]
* 运用LL推导出AST
  * 四则运算的产生式

补充

* (LL)[https://zh.wikipedia.org/wiki/LL%E5%89%96%E6%9E%90%E5%99%A8]：从左到右处理输入，最左边推导构建语法树
* (LR)[https://zh.wikipedia.org/wiki/LR%E5%89%96%E6%9E%90%E5%99%A8]：从左到右处理输入，最右边推导构建语法树



>  模块，AMD.CMD只是模块化的落地方案
>  组件化，高内聚，低耦合， 两个模块之间经常调用，那可以合成一个模块

### 字符串分析算法

* 字典树
  * 大量字符串的完整模式匹配
* KMP
  * 长字符中找子字符串 O（m+n）
* WildCard通配符算法
  * 长字符串中找子串升级版
* 正则
  * 字符串通用模式匹配
* 状态机
  * 通用的字符串分析
* LL LR
  * 字符串多层级结构分析

### Trie 字典树

常和哈希做比较

* [Trie](https://zh.wikipedia.org/wiki/Trie)：用于解决前缀检索（模糊查找），
* [HashMap](https://en.wikipedia.org/wiki/Hash_table): 用于解决O(1)的精确查找，key-value

### KMP

KMP有两种实现方式，两者的基本思想都是一样的，就是在出现不匹配时，利用已知的一部分文本的内容避免回退文本指针，而是只回退模式指针。

* DFA：确定有限自动状态机，状态转移
* PMT：通过数组记录重启位置，匹配失败时，模式串重启到该位置上重新匹配

### wildcard

通配符 `?`,`*`

## 本周作业

* LL算法分析四则运算AST
  > [elementary-arithmetic-ast.js](./example/elementary-arithmetic-ast.js)

* 选做：把正则风格的 tokenize 换成状态机
  > TODO
  
* 选做：实现带括号的四则运算
  > [elementary-arithmetic-ast.js](./example/elementary-arithmetic-ast.js)
  
* 完成 Trie 字典树、KMP、WildCard 算法
  > [trie](./example/trie-map.js)，[KMP](./example/kmp.js)，[wildcard](./example/wildcard.js)
  
* 选做：带? 的 kmp
  > [kmp-wildcard](./example/kmp-wildcard.js)
