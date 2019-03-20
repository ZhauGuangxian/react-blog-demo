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

const assetsPath = (_path) => {
  const assetsSubDirectory = process.env.NODE_ENV === config.prod.ENV
    ? config.prod.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

const webpackConfig = merge(baseWebpackConfig, {
  entry: {
    app: './src/index.jsx',
  },

  mode: 'production',
  devtool: false,
  output: {
    path: config.prod.assetsRoot,
    filename: assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: assetsPath('js/[name].[chunkhash].js'),
  },
  plugins: [

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
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/static'),
        to: config.prod.assetsSubDirectory,
      }
    ])
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
          reuseExistingChunk: false
        },
        "antd-vendor": {
          // || /[\\/]node_modules[\\/]/.test(module.context)
          test: (module) => (/antd/.test(module.context)),
          priority: 2,
          reuseExistingChunk: false
        },

      }
    }

  }
})

module.exports = webpackConfig