// @flow
/* eslint-env node */
import merge from 'webpack-merge';
import common from './webpack.common.babel';
import MinifyPlugin from 'babel-minify-webpack-plugin';
import LodashPlugin from 'lodash-webpack-plugin';

export default merge(common, {
  plugins: [new MinifyPlugin(), new LodashPlugin()],
});
