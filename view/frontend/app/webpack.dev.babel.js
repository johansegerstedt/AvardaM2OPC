// @flow
/* eslint-env node */
import merge from 'webpack-merge';
import {DefinePlugin} from 'webpack';
import common from './webpack.common.babel.js';

export default merge(common, {
  devtool: 'inline-source-map',
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
});
