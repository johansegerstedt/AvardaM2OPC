// @flow
/* eslint-env node */
import path from 'path';
import {DefinePlugin} from 'webpack';
import LodashPlugin from 'lodash-webpack-plugin';

export default {
  entry: ['babel-polyfill', 'whatwg-fetch', './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../web/js'),
    publicPath: '/assets/',
    library: 'avardaCheckout',
    libraryTarget: 'amd',
  },
  externals: {
    'mage/translate': 'mage/translate',
    'mage/url': 'mage/url',
    jquery: 'jquery',
    knockout: 'knockout',
    AvardaCheckOutClient: 'AvardaCheckOutClient',
  },
  devtool: 'source-map',
  plugins: [
    new DefinePlugin({
      'process.env': {},
    }),
    new LodashPlugin({
      shorthands: true,
      collections: true,
      paths: true,
    }),
  ],
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
  resolve: {
    alias: {
      $src: path.resolve(__dirname, 'src/'),
      $i18n: path.resolve(__dirname, 'src/i18n'),
    },
  },
};
