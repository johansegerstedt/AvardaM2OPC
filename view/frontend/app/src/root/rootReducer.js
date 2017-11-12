// @flow
import {combineReducers} from 'redux';
import {cart, cartItems} from '$src/cart/reducers';
import shippingMethods from '$src/shipping/reducers';
import type {AppState, Actions} from './types';

const mainReducer: (AppState | void, Actions) => AppState = combineReducers({
  cart,
  cartItems,
  shippingMethods,
});

export default mainReducer;
