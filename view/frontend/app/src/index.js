// @flow
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root/components/Root';
import configureStore from './root/configureStore';

import './index.scss';

const container = document.getElementById('checkout-root');

if (container !== null) {
  const store = configureStore();
  ReactDOM.render(<Root store={store} />, container);
}
