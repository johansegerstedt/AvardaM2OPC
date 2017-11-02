// @flow
import React from 'react';
import {Provider} from 'react-redux';
import {TranslateProvider, type Translate} from '$i18n';
import {get} from 'lodash';
import App from '$src/app/components/App';
import type {Actions, AppState} from '../types';
import type {Store} from 'redux';

type Props = {
  store: Store<AppState, Actions>,
  t: Translate,
};
type State = {};

class Root extends React.Component<Props, State> {
  clearM2Cache() {
    if (get(window, 'localStorage')) {
      localStorage.removeItem('mage-cache-storage');
    }
  }

  componentWillMount() {
    this.clearM2Cache();
  }

  render() {
    const {store, t} = this.props;
    return (
      <Provider store={store}>
        <TranslateProvider t={t}>
          <App />
        </TranslateProvider>
      </Provider>
    );
  }
}

export default Root;
