const path = require('path')
const pkg = require('../package.json')

module.exports = {
  prod: {
    ENV: 'production',
    assetsRoot: path.resolve(__dirname, `../dist.v${pkg.version}`),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    host:'your host',
    port: '8080',
  },
  dev: {
    ENV: 'development',
    host: '127.0.0.1',
    port: '3000',
    autoOpenBrowser: true,
    devtool: 'cheap-module-eval-source-map',
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

  }
}