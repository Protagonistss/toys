const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    'dev': './src/index.js',
    'prod.min': './src/index.js'
  },
  mode: 'none',
  output: {
    filename: '[name].js',
    library: 'hs',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/
      })
    ]
  }
}