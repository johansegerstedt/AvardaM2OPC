// @flow
import {schema} from 'normalizr';

/*
API
 */
export const cartItemSchema = new schema.Entity(
  'cartItems',
  {},
  {idAttribute: 'item_id'},
);

export const cartSchema = new schema.Entity('cart', {
  items: [cartItemSchema],
});

/*
ACTIONS
 */

const FETCH_REQUEST: 'fetchCartRequest' = 'fetchCartRequest';
const FETCH_SUCCESS: 'fetchCartSuccess' = 'fetchCartSuccess';
const FETCH_FAILURE: 'fetchCartFailure' = 'fetchCartFailure';
const UPDATE_ITEMS_REQUEST: 'updateCartItemsRequest' = 'updateCartItemsRequest';
const UPDATE_ITEMS_SUCCESS: 'updateCartItemsSuccess' = 'updateCartItemsSuccess';
const UPDATE_ITEMS_FAILURE: 'updateCartItemsFailure' = 'updateCartItemsFailure';
const DELETE_ITEM_REQUEST: 'deleteCartItemRequest' = 'deleteCartItemRequest';
const DELETE_ITEM_SUCCESS: 'deleteCartItemSuccess' = 'deleteCartItemSuccess';
const DELETE_ITEM_FAILURE: 'deleteItemFailure' = 'deleteItemFailure';
const APPLY_COUPON_REQUEST: 'applyCouponCodeRequest' = 'applyCouponCodeRequest';
const APPLY_COUPON_SUCCESS: 'applyCouponCodeSuccess' = 'applyCouponCodeSuccess';
const APPLY_COUPON_FAILURE: 'applyCouponCodeFailure' = 'applyCouponCodeFailure';
const REMOVE_COUPON_REQUEST: 'removeCouponRequest' = 'removeCouponRequest';
const REMOVE_COUPON_SUCCESS: 'removeCouponSuccess' = 'removeCouponSuccess';
const REMOVE_COUPON_FAILURE: 'removeCouponFailure' = 'removeCouponFailure';
const REFRESH_CART: 'refreshCart' = 'refreshCart';

export const ActionTypes = {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  UPDATE_ITEMS_SUCCESS,
  UPDATE_ITEMS_REQUEST,
  UPDATE_ITEMS_FAILURE,
  DELETE_ITEM_SUCCESS,
  DELETE_ITEM_REQUEST,
  DELETE_ITEM_FAILURE,
  APPLY_COUPON_SUCCESS,
  APPLY_COUPON_REQUEST,
  APPLY_COUPON_FAILURE,
  REMOVE_COUPON_SUCCESS,
  REMOVE_COUPON_REQUEST,
  REMOVE_COUPON_FAILURE,
  REFRESH_CART,
};
