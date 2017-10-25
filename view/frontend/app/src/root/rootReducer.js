// @flow
import {combineReducers} from 'redux';
import {cart, cartItems} from '$src/cart/reducers';
import type {AppState, Actions} from './types';

const mainReducer: (AppState, Actions) => AppState = combineReducers({
  cart,
  cartItems,
});

export default mainReducer;
