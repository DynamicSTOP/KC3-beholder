'use strict'

process.env.BABEL_ENV = 'background'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const BabiliWebpackPlugin = require('babili-webpack-plugin')

let backgroundConfig = {
  entry: {
    background: path.join(__dirname, '../src/background/kccdp.js')
  },
  externals: [
    ...Object.keys(dependencies || {})
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  output: {
    publicPath: '/',
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  // "web" | "webworker" | "node" | "async-node" | "node-webkit" | "electron-main" | "electron-renderer" | function
  target: 'webworker'
}

/**
 * Adjust backgroundConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  backgroundConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * Adjust backgroundConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  backgroundConfig.plugins.push(
    new BabiliWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = backgroundConfig
