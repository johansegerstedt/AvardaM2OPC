// @flow
import type {Action, Reference} from '$src/types';

export type FETCH_CART = Action<'fetchCart', *>;
export type FETCH_CART_SUCCESS = Action<'fetchCartSuccess', any>;
export type FETCH_CART_FAILURE = Action<'fetchCartFailuer', any>;

export type CartState = {
  id: string,
  items: Reference[],
} | null;

export type CartItemState = {
  id: string,
  sku: string,
  qty: string,
};
