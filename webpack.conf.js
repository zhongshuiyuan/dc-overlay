/*
 * @Author: Caven
 * @Date: 2020-01-18 18:22:23
 * @Last Modified by: Caven
 * @Last Modified time: 2020-07-27 10:47:43
 */

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const JavaScriptObfuscator = require('webpack-obfuscator')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = env => {
  const IS_PROD = (env && env.production) || false
  const publicPath = IS_PROD ? '/' : '/'
  let plugins = [
    new MiniCssExtractPlugin({
      filename: IS_PROD ? '[name].min.css' : '[name].css',
      allChunks: true
    })
  ]
  if (IS_PROD) {
    plugins.push(new OptimizeCssAssetsPlugin())
    plugins.push(new webpack.NoEmitOnErrorsPlugin())
    plugins.push(
      new JavaScriptObfuscator(
        {
          rotateStringArray: true
        },
        []
      )
    )
  }
  return {
    entry: {
      'dc.overlay': ['entry']
    },
    devtool: IS_PROD ? false : 'cheap-module-eval-source-map',
    output: {
      filename: IS_PROD ? '[name].min.js' : '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: publicPath,
      sourcePrefix: ''
    },
    amd: {
      toUrlUndefinded: true
    },
    node: {
      fs: 'empty'
    },
    module: {
      unknownContextCritical: false,
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env'],
            compact: false,
            ignore: ['checkTree']
          }
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 20000
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.json', '.css'],
      alias: {
        '@': resolve('src'),
        entry: './src/index.js'
      }
    },
    plugins
  }
}
