// @flow
/* eslint-env node */
import path from 'path';

export default {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../web/js'),
    publicPath: '/assets/',
    library: 'avardaCheckout',
    libraryTarget: 'amd',
  },
  externals: {
    'mage/translate': 'mage/translate',
    jquery: 'jquery',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    public: 'avarda.box:8080',
  },
  resolve: {
    alias: {
      $src: path.resolve(__dirname, 'src/'),
      $i18n: path.resolve(__dirname, 'src/i18n'),
    },
  },
};
