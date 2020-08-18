# 本周总结

## 工具链-初始化工具

用来将常用的项目配置做成模版，基于 yeoman

参考资料

* [https://yeoman.io/authoring/index.html](https://yeoman.io/authoring/index.html)
* [webpack api](https://webpack.js.org/api/node/#compiler-instance)


## 发布系统

由三部分组成：

* server：实际运行代码的web server
* publish-server：接受打包的项目代码，并解压到web server目录下的server。
* publish-tool：推送打包文件的客户端工具。

## 本周作业

* 跟上课程进度，把工具链做出来
  
  > [toy-tool](./toy-tool/generators/app/index.js)


* 跟上课程进度，写完 publish-sever 和 publish-tool，完成这个发布系统。

  > [publish-server](./publish-server/index.js)  
  > [publish-tool](./publish-tool/publish.js)