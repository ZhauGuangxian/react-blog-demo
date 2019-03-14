const webpack = require('webpack')
const path = require('path')
const config = require('./config')

const merge = require('webpack-merge')
const pkg = require('../package.json')
const TerserPlugin = require('terser-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: config.dev.ENV,
  entry:{
    app:[
      'react-hot-loader/patch',
      `webpack-hot-middleware/client?path=http://${config.dev.host}:${config.dev.port}/__webpack_hmr`,
      './src/index.jsx'
    ],
  },
  output:{
    path: config.dev.assetsRoot,
    chunkFilename: '[name].[chunkhash].js'
  },
  devtool: config.dev.devtool,
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    contentBase: path.join(__dirname, `../dist.v${pkg.version}`), // use CopyWebpackPlugin.
    compress: true,
    host: config.dev.host,
    port: config.dev.port,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxy,

  },

  plugins: [
    //new webpack.HotModuleReplacementPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: pkg.description,
      template: path.resolve(__dirname, '../index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/static'),
        to: config.dev.assetsSubDirectory,

      }
    ]),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${config.dev.host}:${config.dev.port}`],
        clearConsole: true
      }
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCSSAssetsPlugin(),
      new TerserPlugin({
        terserOptions: {
          parse: {

            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,

            comparisons: false,

            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,

            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: false,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        "react-vendor": {
          test: (module) => (/react/.test(module.context) || /redux/.test(module.context)
            || /classnames/.test(module.context) || /prop-types/.test(module.context)),
          priority: 3,
          reuseExistingChunk: true
        },
        "antd-vendor": {
          test: (module) => (/antd/.test(module.context)),
          priority: 2,
          reuseExistingChunk: true
        },
        /*'commons':{
          name:'commons',
          chunks:'initial',

          priority:3
        },
        vendors: {
          name: 'vendors',
          test: function (module) {
            // 阻止.css文件资源打包到vendor chunk中
            if (module.resource && /\.css$/.test(module.resource)) {
              return false;
            }
            // node_modules目录下的模块打包到vendor chunk中
            return module.context && module.context.includes("node_modules");
          },
          priority: -10,
        },*/

      }
    }

  }
})

module.exports = devWebpackConfig