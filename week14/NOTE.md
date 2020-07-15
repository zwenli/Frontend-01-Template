# 本周总结

## 组件化-添加JSX语法

package.json中用到的依赖

```json
"devDependencies": {
  "@babel/core": "^7.10.4",
  "@babel/plugin-transform-react-jsx": "^7.10.4",
  "@babel/preset-env": "^7.10.4",
  "babel-loader": "^8.1.0",
  "webpack": "^4.43.0",
  "webpack-cli": "^3.3.12",
  "webpack-dev-server": "^3.11.0"
}
```

核心`@babel/plugin-transform-react-jsx`会将JSX语法翻译成class语法。

## 组件化-轮播组件

本次实现的feature

* 组件渲染`render`
* 自动轮播`nextPic`
* 鼠标拖拽

## 本周作业

* 完成本周两节课上代码
* 为轮播组件添加鼠标操作

  > [项目代码](./carousel-component)