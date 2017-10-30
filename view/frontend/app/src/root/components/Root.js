// @flow
import React from 'react';
import {Provider} from 'react-redux';
import {get} from 'lodash';
import CartContainer from '$src/cart/components/CartContainer';
import type {Actions, AppState} from '../types';
import type {Store} from 'redux';

type Props = {
  store: Store<AppState, Actions>,
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
    const {store} = this.props;
    return (
      <Provider store={store}>
        <CartContainer />
      </Provider>
    );
  }
}

export default Root;
