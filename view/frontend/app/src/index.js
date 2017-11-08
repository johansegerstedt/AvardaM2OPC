// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root/components/Root';
import configureStore from './root/configureStore';
import {setConfig} from '$src/config';
import type {Config} from './types';

import './index.scss';

export const execute = (config: Config) => {
  try {
    const container = document.getElementById('checkout-root');

    if (container !== null) {
      const store = configureStore();
      setConfig(config);
      ReactDOM.render(<Root config={config} store={store} />, container);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
