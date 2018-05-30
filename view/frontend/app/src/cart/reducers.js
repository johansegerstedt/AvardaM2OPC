// @flow
import {combineReducers} from 'redux';
import {handleActions, combineActions} from 'redux-actions';
import omit from 'lodash/omit';

import {
  fetchCartSuccess,
  updateCartItemsSuccess,
  deleteCartItemSuccess,
  applyCoupon,
  refreshCart,
  applyCouponSuccess,
  removeCouponSuccess,
  updateCartItemsFailure,
  deleteCartItemFailure,
  deleteCartItemRequest,
  updateCartItemsRequest,
  fetchCartRequest,
  fetchCartFailure,
} from './actions';
import type {ActionType} from 'redux-actions';
import type {ById} from '$src/types';
import type {Reducer} from '$src/root/types';
import type {Cart, CartState, CartItemState} from './types';

const cartData: Reducer<null | Cart> = handleActions(
  {
    [combineActions(fetchCartSuccess, refreshCart)]: (
      state,
      {payload: {entities, result}}: ActionType<typeof fetchCartSuccess>,
    ) => entities.cart[result.toString()],
    [combineActions(deleteCartItemSuccess)]: (
      state,
      {payload: deletedId}: ActionType<typeof deleteCartItemSuccess>,
    ) => ({
      ...state,
      items: state.items.filter(id => id !== deletedId),
    }),
    [combineActions(applyCouponSuccess)]: (
      state,
      {payload: coupon_code}: ActionType<typeof applyCoupon>,
    ) => ({
      ...state,
      coupon_code,
    }),
    [combineActions(removeCouponSuccess)]: state => omit(state, 'coupon_code'),
  },
  null,
);

const pendingUpdates: Reducer<number> = handleActions(
  {
    [combineActions(updateCartItemsRequest, deleteCartItemRequest)]: state =>
      state + 1,
    [combineActions(
      updateCartItemsSuccess,
      updateCartItemsFailure,
      deleteCartItemSuccess,
      deleteCartItemFailure,
    )]: state => Math.max(state - 1, 0),
  },
  0,
);

const isFetching = handleActions(
  {
    [combineActions(fetchCartRequest)]: () => true,
    [combineActions(fetchCartSuccess, fetchCartFailure)]: () => false,
  },
  false,
);
export const cartItemsById: Reducer<null | ById<Cart>> = handleActions(
  {
    [combineActions(fetchCartSuccess)]: (
      state,
      {payload: {entities}}: ActionType<typeof fetchCartSuccess>,
    ) => entities.cartItems,
    [combineActions(deleteCartItemRequest)]: (
      state,
      {payload: itemId}: ActionType<typeof deleteCartItemSuccess>,
    ) => ({
      ...state,
      [itemId]: {
        ...state[itemId],
        isDeleting: true,
      },
    }),
    [combineActions(updateCartItemsSuccess)]: (
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
    [combineActions(deleteCartItemSuccess)]: (
      state = {},
      {payload: deletedItem}: ActionType<typeof deleteCartItemSuccess>,
    ) => omit(state, deletedItem),
  },
  null,
);

export const cart: Reducer<CartState> = combineReducers({
  data: cartData,
  isFetching,
  pendingUpdates,
});

export const cartItems: Reducer<CartItemState> = combineReducers({
  byId: cartItemsById,
  isFetching: () => false,
});
