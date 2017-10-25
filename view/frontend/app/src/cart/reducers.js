// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {fetchCartSuccess} from './actions';
import {ActionTypes} from './constants';
import type {ActionType} from 'redux-actions';
import type {ById} from '$src/types';
import type {Reducer} from '$src/root/types';
import type {Cart, CartState, CartItemState} from './types';

const cartData: Reducer<null | Cart> = handleActions(
  {
    [ActionTypes.FETCH_SUCCESS]: (
      state,
      {payload: {entities, result}}: ActionType<typeof fetchCartSuccess>,
    ) => entities.cart[result.toString()],
  },
  null,
);

export const cart: Reducer<CartState> = combineReducers({
  data: cartData,
  isFetching: () => false,
});

export const cartItemsById: Reducer<null | ById<Cart>> = handleActions(
  {
    [ActionTypes.FETCH_SUCCESS]: (
      state,
      {payload: {entities}}: ActionType<typeof fetchCartSuccess>,
    ) => entities.cartItems,
  },
  null,
);

export const cartItems: Reducer<CartItemState> = combineReducers({
  byId: cartItemsById,
  isFetching: () => false,
});
