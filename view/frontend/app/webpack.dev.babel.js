// @flow
/* eslint-env node */
import merge from 'webpack-merge';
import {DefinePlugin} from 'webpack';
import Visualizer from 'webpack-visualizer-plugin';
import common from './webpack.common.babel.js';
import DashboardPlugin from 'webpack-dashboard/plugin';

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
    new DashboardPlugin(),
  ],
  // stats: {
  //   colors: true,
  //   performance: true,
  //   warnings: true,
  // },
});
