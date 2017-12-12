// @flow
/* eslint-env node */
import merge from 'webpack-merge';
import common from './webpack.common.babel';

export default merge(common, {
  // Using -p flag => no need to set anything here
});
