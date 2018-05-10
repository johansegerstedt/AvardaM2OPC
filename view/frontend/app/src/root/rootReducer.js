// @flow
import {combineReducers} from 'redux';
import {loadingBarReducer} from 'react-redux-loading-bar';
import {cart, cartItems} from '$src/cart/reducers';
import shippingMethods from '$src/shipping/reducers';
import avarda from '$src/avarda/reducers';
import type {AppState, Actions} from './types';

const mainReducer: (AppState | void, Actions) => AppState = combineReducers({
  loadingBar: loadingBarReducer,
  avarda,
  cart,
  cartItems,
  shippingMethods,
});

export default mainReducer;
