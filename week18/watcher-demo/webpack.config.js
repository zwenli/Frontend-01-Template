module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader', // babel会将ECMAScript新版本的代码转换成向后兼容的JavaScript代码
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: 'development', // 开发模式
  optimization: {
    minimize: false // 不压缩代码
  }
}