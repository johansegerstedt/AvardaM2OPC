// @flow
/* eslint-env node */
import merge from 'webpack-merge';
import prod from './webpack.prod.babel';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

export default merge(prod, {
  plugins: [new BundleAnalyzerPlugin()],
});
