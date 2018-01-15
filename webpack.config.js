const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: './static/js/main.jsx',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'static/dist/')
  },
  devServer: {
    compress: true,
    host: '0.0.0.0',
    port: 5001,
    public: process.env.SL_PUBLIC_URL || null,
    publicPath: '/static/dist/js/'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    }),
    new webpack.HotModuleReplacementPlugin({
      multiStep: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
