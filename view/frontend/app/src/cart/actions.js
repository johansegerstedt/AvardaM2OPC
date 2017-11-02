// @flow
import {createAction} from 'redux-actions';
import {ActionTypes as Cart} from './constants';
import {PayloadCreators} from '$src/utils/redux';
import type {ActionType} from 'redux-actions';
import type {CartItem, NormalizedCart} from './types';

const {createError, createString, createVoid} = PayloadCreators;

export const fetchCartRequest = createAction(Cart.FETCH_REQUEST, createVoid);

export const fetchCartSuccess = createAction(
  Cart.FETCH_SUCCESS,
  (normalizedCart: NormalizedCart): NormalizedCart => normalizedCart,
);

export const fetchCartFailure = createAction(Cart.FETCH_FAILURE, createError);

export const updateCartItems = createAction(
  Cart.UPDATE_ITEMS_REQUEST,
  (items: CartItem[]): CartItem[] => items,
);

export const updateCartItemsSuccess = createAction(
  Cart.UPDATE_ITEMS_SUCCESS,
  (items: CartItem[]): CartItem[] => items,
);

export const updateCartItemsFailure = createAction(
  Cart.UPDATE_ITEMS_FAILURE,
  createError,
);

export const deleteCartItem = createAction(
  Cart.DELETE_ITEM_REQUEST,
  (itemId: string): string => itemId,
);

export const deleteCartItemSuccess = createAction(
  Cart.DELETE_ITEM_SUCCESS,
  (deletedId: string): string => deletedId,
);

export const deleteCartItemFailure = createAction(
  Cart.DELETE_ITEM_FAILURE,
  createError,
);

export const applyCoupon = createAction(
  Cart.APPLY_COUPON_REQUEST,
  createString,
);

export const applyCouponSuccess = createAction(
  Cart.APPLY_COUPON_SUCCESS,
  createString,
);

export const applyCouponFailure = createAction(
  Cart.APPLY_COUPON_FAILURE,
  createError,
);

export const removeCoupon = createAction(
  Cart.REMOVE_COUPON_REQUEST,
  createVoid,
);

export const removeCouponSuccess = createAction(
  Cart.REMOVE_COUPON_SUCCESS,
  createVoid,
);

export const removeCouponFailure = createAction(
  Cart.REMOVE_COUPON_FAILURE,
  createError,
);

export type CartActions =
  | ActionType<typeof fetchCartRequest>
  | ActionType<typeof fetchCartSuccess>
  | ActionType<typeof fetchCartFailure>
  | ActionType<typeof updateCartItems>
  | ActionType<typeof updateCartItemsSuccess>
  | ActionType<typeof updateCartItemsFailure>
  | ActionType<typeof deleteCartItem>
  | ActionType<typeof deleteCartItemSuccess>
  | ActionType<typeof deleteCartItemFailure>
  | ActionType<typeof applyCoupon>
  | ActionType<typeof applyCouponSuccess>
  | ActionType<typeof applyCouponFailure>
  | ActionType<typeof removeCoupon>
  | ActionType<typeof removeCouponSuccess>
  | ActionType<typeof removeCouponFailure>;
