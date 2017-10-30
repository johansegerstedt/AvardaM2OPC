// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {omit} from 'lodash';
import {
  fetchCartSuccess,
  updateCartItemsSuccess,
  deleteCartItemSuccess,
} from './actions';
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
    [ActionTypes.DELETE_ITEM_SUCCESS]: (
      state,
      {payload: deletedId}: ActionType<typeof deleteCartItemSuccess>,
    ) => ({
      ...state,
      items: state.items.filter(id => id !== deletedId),
    }),
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
    [ActionTypes.UPDATE_ITEMS_SUCCESS]: (
      state = {},
      {payload: items = []}: ActionType<typeof updateCartItemsSuccess>,
    ) =>
      items.reduce(
        (newState, {item_id, qty}) => ({
          ...newState,
          [item_id]: {...state[item_id], qty},
        }),
        state,
      ),
    [ActionTypes.DELETE_ITEM_SUCCESS]: (
      state = {},
      {payload: deletedItem}: ActionType<typeof deleteCartItemSuccess>,
    ) => omit(state, deletedItem),
  },
  null,
);

export const cartItems: Reducer<CartItemState> = combineReducers({
  byId: cartItemsById,
  isFetching: () => false,
  isUpserting: () => false,
  isDeleting: () => false,
});
