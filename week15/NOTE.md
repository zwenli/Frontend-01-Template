# 本周总结

## 组件化-VUE风格的sfc

需要编写webpack loader去编译sfc文件，三个模块，template，script，style

资料：

* [https://webpack.js.org/contribute/writing-a-loader/](https://webpack.js.org/contribute/writing-a-loader/)

## 组件化-动画

基于JS实现的动画，可开始/结束，暂停/恢复

一个重要的概念：时间线Timeline，一个时间线可以添加多个动画，统一操作动画的播放动作。

## 本周作业

* 完善 loader 部分代码

  > [myloader.js](./sfc-component/myloader.js)

* 完成animation组件

  > [项目代码](./animation)
  
* 将animation完善进carousel组件
  
  > [项目代码](./carousel-animation)