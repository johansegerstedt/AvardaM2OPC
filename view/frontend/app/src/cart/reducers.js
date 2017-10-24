// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {ActionTypes} from './constants';
import type {CartState} from './types';

const cart: (CartState, any) => CartState = handleActions(
  {
    [ActionTypes.FETCH_SUCCESS]: (state, {payload}) => payload,
  },
  null,
);

// TODO const cartItems = (state): {string: CartItemState} => state;

export default combineReducers({
  cart,
});
