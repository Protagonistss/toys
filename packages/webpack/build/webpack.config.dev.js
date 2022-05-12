const webpack = require('webpack')
const { Configuration } = require('webpack')
const { default: merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

/**
 * @type { Configuration }
 */
const devConfig = {
  mode: 'development',
  devtool: 'cheap-source-map',
  devServer: {
    contentBase: '../dist',
    hot: true,
  },
  stats: 'errors-only',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = merge(baseConfig , devConfig)
