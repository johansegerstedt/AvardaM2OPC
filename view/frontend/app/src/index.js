// @flow
import 'Magento_Ui/js/lib/knockout/bootstrap';
import 'es6-collections'; // Magento's polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import url from 'mage/url';
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
      url.setBaseUrl(config.baseUrl);
      ReactDOM.render(<Root config={config} store={store} />, container);
    }

    if (process.env.NODE_ENV !== 'production') {
      const mainContent = document.getElementById('maincontent');

      // IE and Edge don't support ParentNode.prepend
      // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend
      const canUseExperimentalPrepend =
        mainContent && typeof mainContent.prepend === 'function';
      if (mainContent !== null && canUseExperimentalPrepend) {
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
