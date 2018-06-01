// @flow
import React, {Component, Fragment} from 'react';
import {Provider} from 'react-redux';
import get from 'lodash/get';
import {ToastContainer} from 'react-toastify';
import App from '$src/app/components/App';
import type {Actions, AppState} from '../types';
import type {Store} from 'redux';

type Props = {
  store: Store<AppState, Actions>,
};
type State = {};

class Root extends Component<Props, State> {
  clearM2Cache() {
    if (get(window, 'localStorage')) {
      localStorage.removeItem('mage-cache-storage');
    }
  }

  componentDidMount() {
    this.clearM2Cache();
  }

  render() {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <Fragment>
          <App />
          <ToastContainer autoClose={10000} closeButton={false} />
        </Fragment>
      </Provider>
    );
  }
}

export default Root;
