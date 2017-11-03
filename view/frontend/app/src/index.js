// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root/components/Root';
import configureStore from './root/configureStore';
import {setConfig} from '$src/config';
import type {MageTranslate} from '$i18n';
import type {Config} from './types';

import './index.scss';

export const execute = (
  config: Config,
  mageTranslate: MageTranslate = str => `t('${str}')`,
) => {
  try {
    const container = document.getElementById('checkout-root');

    if (container !== null) {
      const store = configureStore();
      setConfig(config);
      ReactDOM.render(
        <Root store={store} mageTranslate={mageTranslate} />,
        container,
      );
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
