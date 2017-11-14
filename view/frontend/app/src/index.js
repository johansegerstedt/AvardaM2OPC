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

    if (process.env.NODE_ENV !== 'production') {
      const mainContent = document.getElementById('maincontent');
      if (mainContent !== null) {
        const configContainer = document.createElement('div');
        configContainer.id = 'avardaCheckoutConfigContainer';
        mainContent.prepend(configContainer);
        ReactDOM.render(
          <pre>{JSON.stringify(config, null, 2)}</pre>,
          configContainer,
        );
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
