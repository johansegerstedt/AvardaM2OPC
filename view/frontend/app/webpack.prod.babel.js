// @flow
/* eslint-env node */
import merge from 'webpack-merge';
import common from './webpack.common.babel';
import {DefinePlugin} from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

export default merge(common, {
  mode: 'production',
  plugins: [
    new UglifyJsPlugin({sourceMap: true}),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
