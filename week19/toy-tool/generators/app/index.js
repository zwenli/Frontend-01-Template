const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    // this.option('babel'); // This method adds support for a `--babel` flag
  }
  collecting() {
    this.log('collecting');
  }
  creating() {
    this.log('creating');
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { title: 'toy-tool' },
    )
    this.fs.copyTpl(
      this.templatePath('createElement.js'),
      this.destinationPath('lib/createElement.js'),
    )
    this.fs.copyTpl(
      this.templatePath('animation.js'),
      this.destinationPath('lib/animation.js'),
    )
    this.fs.copyTpl(
      this.templatePath('gusture.js'),
      this.destinationPath('lib/gusture.js'),
    )
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
    )
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('index.html'),
      { title: 'toy-tool' },
    )
    this.fs.copyTpl(
      this.templatePath('main.test.js'),
      this.destinationPath('test/main.test.js'),
    )
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
    )
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
    )
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc'),
    )
    this.npmInstall([
      'babel-loader',
      '@babel/core',
      '@babel/preset-env',
      '@babel/plugin-transform-react-jsx',
      'css',
      'css-loader',
      'webpack',
      'webpack-cli',
      'webpack-dev-server',
      'html-webpack-plugin',
      'mocha',
      'nyc',
      'babel-plugin-istanbul',
      '@babel/register',
      '@istanbuljs/nyc-config-babel',
    ], { 'save-dev': true })
  }
}