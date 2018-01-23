// @flow
import React, {Fragment} from 'react';
import {Provider} from 'react-redux';
import {get} from 'lodash';
import {ToastContainer} from 'react-toastify';
import App from '$src/app/components/App';
import type {Config} from '$src/types';
import type {Actions, AppState} from '../types';
import type {Store} from 'redux';

type Props = {
  store: Store<AppState, Actions>,
  config: Config,
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
    const {config, store} = this.props;
    return (
      <Provider store={store}>
        <Fragment>
          <App config={config} />
          <ToastContainer autoClose={10000} closeButton={false} />
        </Fragment>
      </Provider>
    );
  }
}

export default Root;
