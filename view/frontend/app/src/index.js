// @flow
import 'Magento_Ui/js/lib/knockout/bootstrap'; // Bootstrap Knockout with Magento stuff
import 'es6-collections'; // Magento's polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import url from 'mage/url';
import Root from '$src/root/components/Root';
import configureStore from '$src/root/configureStore';
import {setConfig} from '$src/config';
import type {Config} from '$src/types';

// $FlowFixMe
import './styles.less';

export const execute = (config: Config) => {
  try {
    const container = document.getElementById('checkout-root');

    if (container !== null) {
      const store = configureStore();
      // Initialize configuration singleton
      setConfig(config);
      // Set base URL for Magento's JS actions
      url.setBaseUrl(config.baseUrl);
      ReactDOM.render(<Root store={store} />, container);
    } else {
      throw new Error("Couldn't mount the checkout application.");
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
