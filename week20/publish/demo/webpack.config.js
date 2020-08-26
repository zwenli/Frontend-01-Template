
module.exports = {
  entry: './main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader', // babel会将ECMAScript新版本的代码转换成向后兼容的JavaScript代码
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              // babel的插件，这个是用来编译jsx的
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'createElement',
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.view/,
        use:{
          loader: require.resolve("./myloader.js")
        }
      },
      {
        test: /\.css$/,
        use:{
          loader: require.resolve("./cssloader.js")
        }
      },
    ],
  },
  mode: 'development', // 开发模式
  optimization: {
    minimize: false // 不压缩代码
  }
}