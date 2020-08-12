# 本周总结

## Dev工具

* Server
  * build: webpack babel vue jsx postcss ...
  * watch: fsevent
  * mock: 
  * http: ws http-server
* Client
  * debugger: vscode devtool（需要实现server提供的debugger方法和事件）
  * source map（算是devtool的一部分）

代码运行在server上 ，常见的server有browser，node-v8，eletron，debuuger和JavaScriptCore在同个进程中  
IDE，devtool是客户端，和server基于协议去通信，从而控制代码的运行/暂停

参考资料

* [Chrome DevTools Protocol ](https://chromedevtools.github.io/devtools-protocol/tot/Debugger/)

## 本周作业

* 跟上课程进度，将 parser.js 的 test case 补充完整，并将它的 coverage 做到 90 以上

  > [parser.test.js](./test-demo/test/parser.test.js)
