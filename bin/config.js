const path = require('path')
const pkg = require('../package.json')

module.exports = {
  prod: {
    ENV: 'production',
    assetsRoot: path.resolve(__dirname, `../dist.v${pkg.version}`),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    host:'120.79.204.25',
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
    /*proxy: {
      '/api': {
        "target": "http://http://120.76.40.19:8080",
        "changeOrigin": true,
      }
    }*/
  }
}