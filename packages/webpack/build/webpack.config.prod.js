const { Configuration } = require('webpack')
const { default: merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

/**
 * @type { Configuration }
 */
const prodConfig = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [ new CssMinimizerPlugin(), new TerserPlugin() ],
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'verdors',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  }
}

module.exports = merge(baseConfig, prodConfig)