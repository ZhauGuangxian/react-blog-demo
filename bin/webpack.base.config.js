const path = require('path')
const config = require('./config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const resolve = (dir) => path.join(__dirname, '..', dir)

const assetsPath = (_path) => {
  const assetsSubDirectory = process.env.NODE_ENV === config.prod.ENV
    ? config.prod.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

module.exports = {

  /*entry: {
    app: './src/index.jsx',
  },*/
  output: {
    publicPath: process.env.NODE_ENV === config.prod.ENV
      ? config.prod.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@components': path.resolve(__dirname, '../src/components'),
      '@': resolve('src'),

    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        use: {
          loader:'babel-loader',
          options: {
            presets: ["env", "react", 'stage-0'],
            plugins: [
              ['import', [{ libraryName: 'antd', javascriptEnabled: true ,style:true}]]
            ]
          }
        },
        include: resolve('src')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('font/[name].[ext]')
        }
      },
      {
        test: /\.css$/,

        use: [{
          loader: 'style-loader'
        }, {
          loader: "css-loader",
          options: {
            name: "[path][name].[ext]",

          }
        }]
      },
      {
        test: /\.less$/,

        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ]
      },
      {
        test: /\.scss$/,

        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      }
    ]
  },
  plugins:[
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    })
  ]
}