// @flow
import React from 'react';
import {Provider} from 'react-redux';
import CartContainer from '$src/cart/components/CartContainer';
import type {AppState} from '../types';
import type {Action} from '../../types';
import type {Store} from 'redux';

type Props = {
  store: Store<AppState, Action<*, *>>,
};
type State = {};

class Root extends React.Component<Props, State> {
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
