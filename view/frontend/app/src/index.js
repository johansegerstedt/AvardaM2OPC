// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root/components/Root';
import configureStore from './root/configureStore';
import {validate} from '$src/config';

import './index.scss';

try {
  const container = document.getElementById('checkout-root');

  if (container !== null) {
    validate();
    const store = configureStore();
    ReactDOM.render(<Root store={store} />, container);
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
}
