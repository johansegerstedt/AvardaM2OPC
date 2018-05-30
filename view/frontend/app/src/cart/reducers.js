// @flow
import {combineReducers} from 'redux';
import {handleActions, combineActions} from 'redux-actions';
import omit from 'lodash/omit';

import {
  fetchCartSuccess,
  updateCartItemsSuccess,
  deleteCartItem,
  deleteCartItemSuccess,
  applyCoupon,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  UPDATE_ITEMS_REQUEST,
  UPDATE_ITEMS_SUCCESS,
  UPDATE_ITEMS_FAILURE,
  DELETE_ITEM_REQUEST,
  DELETE_ITEM_SUCCESS,
  DELETE_ITEM_FAILURE,
  APPLY_COUPON_SUCCESS,
  REMOVE_COUPON_SUCCESS,
  REFRESH_CART,
} from './actions';
import type {ActionType} from 'redux-actions';
import type {ById} from '$src/types';
import type {Reducer} from '$src/root/types';
import type {Cart, CartState, CartItemState} from './types';

const cartData: Reducer<null | Cart> = handleActions(
  {
    [combineActions(FETCH_SUCCESS, REFRESH_CART)]: (
      state,
      {payload: {entities, result}}: ActionType<typeof fetchCartSuccess>,
    ) => entities.cart[result.toString()],
    [DELETE_ITEM_SUCCESS]: (
      state,
      {payload: deletedId}: ActionType<typeof deleteCartItemSuccess>,
    ) => ({
      ...state,
      items: state.items.filter(id => id !== deletedId),
    }),
    [APPLY_COUPON_SUCCESS]: (
      state,
      {payload: coupon_code}: ActionType<typeof applyCoupon>,
    ) => ({
      ...state,
      coupon_code,
    }),
    [REMOVE_COUPON_SUCCESS]: state => omit(state, 'coupon_code'),
  },
  null,
);

const pendingUpdates: Reducer<number> = handleActions(
  {
    [combineActions(UPDATE_ITEMS_REQUEST, DELETE_ITEM_REQUEST)]: state =>
      state + 1,
    [combineActions(
      UPDATE_ITEMS_SUCCESS,
      UPDATE_ITEMS_FAILURE,
      DELETE_ITEM_SUCCESS,
      DELETE_ITEM_FAILURE,
    )]: state => Math.max(state - 1, 0),
  },
  0,
);

const isFetching = handleActions(
  {
    [FETCH_REQUEST]: () => true,
    [combineActions(FETCH_SUCCESS, FETCH_FAILURE)]: () => false,
  },
  false,
);

export const cart: Reducer<CartState> = combineReducers({
  data: cartData,
  isFetching,
  pendingUpdates,
});

export const cartItemsById: Reducer<null | ById<Cart>> = handleActions(
  {
    [FETCH_SUCCESS]: (
      state,
      {payload: {entities}}: ActionType<typeof fetchCartSuccess>,
    ) => entities.cartItems,
    [DELETE_ITEM_REQUEST]: (
      state,
      {payload: itemId}: ActionType<typeof deleteCartItem>,
    ) => ({
      ...state,
      [itemId]: {
        ...state[itemId],
        isDeleting: true,
      },
    }),
    [UPDATE_ITEMS_SUCCESS]: (
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
    [DELETE_ITEM_SUCCESS]: (
      state = {},
      {payload: deletedItem}: ActionType<typeof deleteCartItemSuccess>,
    ) => omit(state, deletedItem),
  },
  null,
);

export const cartItems: Reducer<CartItemState> = combineReducers({
  byId: cartItemsById,
  isFetching: () => false,
});
