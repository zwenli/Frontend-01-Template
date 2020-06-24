# 本周总结

## Promise与异步编程

* Promise
* async/await

async/await 本质还是基于Promise的

## 编程与算法训练-寻路

功能：1、画地图；2、保存地图；3、根据起点和终点找到路径

要点：

* 路径编辑器
* 寻路函数
  * 搜索算法
    * 广度优先搜索（相比深度优先搜索更适合用来探讨最短路径的模型）
    * Dijkstra 算法（广度优先算是它的一种特例）
    * Greedy Best-First Search
    * [A*搜索](https://zh.wikipedia.org/wiki/A*%E6%90%9C%E5%B0%8B%E6%BC%94%E7%AE%97%E6%B3%95)

参考：

* [introduction A*](https://www.redblobgames.com/pathfinding/a-star/introduction.html)

## 正则

### match

match(//) 和 match(//g)的区别

```js
'[a=value]'.match(/\[([^=]+)=([^\]]+)\]/)
RegExp.$1 // attr
RegExp.$2 // val
```

* () 捕获
* (?:) 不捕获

### replace

```js
'abc'.replace(/a(b)c/, function(str, $1) {
  console.log($1)
  return $1 + $1
})

'abc'.replace(/a(b)c/, '$1$1')
```

### exec

* exec
* lastIndex

## 作业

* 完成课上布置的练习，并将编程训练的寻路完成

  > [path-binaryHeap.html](./example/path-binaryHeap.html)