// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root/components/Root';
import configureStore from './root/configureStore';
import {validate} from '$src/config';
import type {Translate} from '$i18n';

import './index.scss';

export const execute = (t: Translate = str => `t('${str}')`) => {
  try {
    const container = document.getElementById('checkout-root');

    if (container !== null) {
      validate();
      const store = configureStore();
      ReactDOM.render(<Root store={store} t={t} />, container);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
