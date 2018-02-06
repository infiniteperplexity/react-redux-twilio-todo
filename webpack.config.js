var path = require('path');
var webpack = require('webpack');
     
 module.exports = {
     entry: './js/index.jsx',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'app.bundle.js'
     },
     module: {
         loaders: [
             {
                 test: /\.jsx?$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015', 'react', 'stage-0']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };