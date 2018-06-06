// @flow
/* eslint-env node */
import path from 'path';
import {DefinePlugin} from 'webpack';
import LodashPlugin from 'lodash-webpack-plugin';

// Required polyfills that are not covered with Magento's es6-collections or
// babel-transform-runtime plugin in .babelrc (the plugin is used without
// polyfills to not conflict with es6-collections).
const polyfills = [
  'core-js/fn/symbol',
  'core-js/fn/symbol/iterator',
  'core-js/fn/promise',
  'whatwg-fetch',
];

export default {
  entry: [...polyfills, './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../web/js'),
    publicPath: '/assets/',
    library: 'avardaCheckout',
    libraryTarget: 'amd', // Bundle will be consumed with Require.js
  },
  // Externals aka Require.js dependencies
  externals: {
    'Magento_Ui/js/lib/knockout/bootstrap':
      'Magento_Ui/js/lib/knockout/bootstrap',
    AvardaCheckOutClient: 'AvardaCheckOutClient',
    'es6-collections': 'es6-collections',
    jquery: 'jquery',
    knockout: 'knockout',
    'mage/translate': 'mage/translate',
    'mage/url': 'mage/url',
    'Magento_Checkout/js/action/select-shipping-address':
      'Magento_Checkout/js/action/select-shipping-address',
    'Magento_Checkout/js/action/select-shipping-method':
      'Magento_Checkout/js/action/select-shipping-method',
    'Magento_Checkout/js/action/set-shipping-information':
      'Magento_Checkout/js/action/set-shipping-information',
    'Magento_Checkout/js/model/address-converter':
      'Magento_Checkout/js/model/address-converter',
    'Magento_Checkout/js/model/new-customer-address':
      'Magento_Checkout/js/model/new-customer-address',
    'Magento_Checkout/js/model/quote': 'Magento_Checkout/js/model/quote',
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
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            // options: {
            //   modules: true,
            //   importLoaders: 1,
            // },
          },
          {
            loader: 'less-loader', // compiles Less to CSS
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
    modules: ['src', 'node_modules'],
    alias: {
      $src: path.resolve(__dirname, 'src/'),
      $i18n: path.resolve(__dirname, 'src/i18n'),
    },
  },
};
