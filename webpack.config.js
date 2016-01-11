var path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    root: [__dirname],
    extensions: ['', '.js'],
    alias: {
      'olmo': path.resolve('./src')
    }
  },
  output: {
    path: '.',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: path.resolve('.')
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  }
};
