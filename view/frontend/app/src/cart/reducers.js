// @flow
import {combineReducers} from 'redux';
import {handleActions, combineActions} from 'redux-actions';
import {omit} from 'lodash';
import {
  fetchCartSuccess,
  updateCartItemsSuccess,
  deleteCartItem,
  deleteCartItemSuccess,
  applyCoupon,
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
    [ActionTypes.APPLY_COUPON_SUCCESS]: (
      state,
      {payload: coupon_code}: ActionType<typeof applyCoupon>,
    ) => ({
      ...state,
      coupon_code,
    }),
    [ActionTypes.REMOVE_COUPON_SUCCESS]: state => omit(state, 'coupon_code'),
  },
  null,
);

const pendingUpdates: Reducer<number> = handleActions(
  {
    [combineActions(
      ActionTypes.UPDATE_ITEMS_REQUEST,
      ActionTypes.DELETE_ITEM_REQUEST,
    )]: state => state + 1,
    [combineActions(
      ActionTypes.UPDATE_ITEMS_SUCCESS,
      ActionTypes.UPDATE_ITEMS_FAILURE,
      ActionTypes.DELETE_ITEM_SUCCESS,
      ActionTypes.DELETE_ITEM_FAILURE,
    )]: state => Math.max(state - 1, 0),
  },
  0,
);

const isFetching = handleActions(
  {
    [ActionTypes.FETCH_REQUEST]: () => true,
    [combineActions(
      ActionTypes.FETCH_SUCCESS,
      ActionTypes.FETCH_FAILURE,
    )]: () => false,
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
    [ActionTypes.FETCH_SUCCESS]: (
      state,
      {payload: {entities}}: ActionType<typeof fetchCartSuccess>,
    ) => entities.cartItems,
    [ActionTypes.DELETE_ITEM_REQUEST]: (
      state,
      {payload: itemId}: ActionType<typeof deleteCartItem>,
    ) => ({
      ...state,
      [itemId]: {
        ...state[itemId],
        isDeleting: true,
      },
    }),
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
});
