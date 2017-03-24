var path = require('path');
var HtmlWebpackPlugin = require('webpack-html-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/index.html',
  filename: 'index.html',
  inject: 'body'
});
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports={
  devtool: "source-map",
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname + '/dist',
    //publicPath: 'https://github.com/genestd/portfolio',
    filename: "index_bundle.js"
  },
  devServer: {
    contentBase: __dirname + '/dist'
  },
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'file-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
      { test: /\.css/, loader: ExtractTextPlugin.extract("css")},
      { test: /\.scss$/, loaders: [ 'style', 'css?sourceMap', 'sass?sourceMap' ]}
    ]
  },
  plugins: [
    HTMLWebpackPluginConfig,
    new CopyWebpackPlugin([
            { from: './src/utils/gear.svg', to: 'utils/gear.svg'},
            { from: './src/utils/exit.svg', to: 'utils/exit.svg'},
        ]),
    new ExtractTextPlugin("styles.css")
  ]
};
