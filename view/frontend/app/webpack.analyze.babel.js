// @flow
/* eslint-env node */
import merge from 'webpack-merge';
import prod from './webpack.prod.babel';
import Visualizer from 'webpack-visualizer-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

export default merge(prod, {
  plugins: [
    new Visualizer({
      filename: './stat/statistics.html',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
    }),
  ],
});
