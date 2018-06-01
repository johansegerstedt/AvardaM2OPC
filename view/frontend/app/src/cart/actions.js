// @flow
import {createAction, type ActionType} from 'redux-actions';
import {PayloadCreators} from '$src/utils/redux';
import type {CartItem, NormalizedCart} from './types';

export const FETCH_REQUEST = 'cart/fetchCartRequest';
export const FETCH_SUCCESS = 'cart/fetchCartSuccess';
export const FETCH_FAILURE = 'cart/fetchCartFailure';
export const UPDATE_ITEMS_REQUEST = 'cart/updateCartItemsRequest';
export const UPDATE_ITEMS_SUCCESS = 'cart/updateCartItemsSuccess';
export const UPDATE_ITEMS_FAILURE = 'cart/updateCartItemsFailure';
export const DELETE_ITEM_REQUEST = 'cart/deleteCartItemRequest';
export const DELETE_ITEM_SUCCESS = 'cart/deleteCartItemSuccess';
export const DELETE_ITEM_FAILURE = 'cart/deleteItemFailure';
export const APPLY_COUPON_REQUEST = 'cart/applyCouponCodeRequest';
export const APPLY_COUPON_SUCCESS = 'cart/applyCouponCodeSuccess';
export const APPLY_COUPON_FAILURE = 'cart/applyCouponCodeFailure';
export const REMOVE_COUPON_REQUEST = 'cart/removeCouponRequest';
export const REMOVE_COUPON_SUCCESS = 'cart/removeCouponSuccess';
export const REMOVE_COUPON_FAILURE = 'cart/removeCouponFailure';
export const REFRESH_CART = 'cart/refreshCart';

const {createError, createString, createVoid} = PayloadCreators;

const normalized = (normalizedCart: NormalizedCart): NormalizedCart =>
  normalizedCart;

export const fetchCartRequest = createAction(FETCH_REQUEST, createVoid);
export const fetchCartSuccess = createAction(FETCH_SUCCESS, normalized);
export const fetchCartFailure = createAction(FETCH_FAILURE, createError);
export const refreshCart = createAction(REFRESH_CART, normalized);

export const updateCartItems = createAction(
  UPDATE_ITEMS_REQUEST,
  (items: CartItem[]): CartItem[] => items,
);

export const updateCartItemsSuccess = createAction(
  UPDATE_ITEMS_SUCCESS,
  (items: CartItem[]): CartItem[] => items,
);

export const updateCartItemsFailure = createAction(
  UPDATE_ITEMS_FAILURE,
  createError,
);

export const deleteCartItem = createAction(
  DELETE_ITEM_REQUEST,
  (itemId: string): string => itemId,
);

export const deleteCartItemSuccess = createAction(
  DELETE_ITEM_SUCCESS,
  (deletedId: string): string => deletedId,
);

export const deleteCartItemFailure = createAction(
  DELETE_ITEM_FAILURE,
  createError,
);

export const applyCoupon = createAction(APPLY_COUPON_REQUEST, createString);

export const applyCouponSuccess = createAction(
  APPLY_COUPON_SUCCESS,
  createString,
);

export const applyCouponFailure = createAction(
  APPLY_COUPON_FAILURE,
  createError,
);

export const removeCoupon = createAction(REMOVE_COUPON_REQUEST, createVoid);

export const removeCouponSuccess = createAction(
  REMOVE_COUPON_SUCCESS,
  createVoid,
);

export const removeCouponFailure = createAction(
  REMOVE_COUPON_FAILURE,
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
