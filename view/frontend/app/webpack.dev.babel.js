// @flow
/* eslint-env node */
import {DefinePlugin} from 'webpack';
import merge from 'webpack-merge';
import common from './webpack.common.babel.js';
import DashboardPlugin from 'webpack-dashboard/plugin';
// import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import Visualizer from 'webpack-visualizer-plugin';

export default merge(common, {
  mode: 'development',
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new Visualizer({
      filename: './stat/statistics.html',
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    // }),
    new DashboardPlugin(),
  ],
  // stats: {
  //   colors: true,
  //   performance: true,
  //   warnings: true,
  // },
});
