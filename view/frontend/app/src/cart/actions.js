// @flow
import {createAction} from 'redux-actions';
import {ActionTypes as Cart} from './constants';
import type {ActionType} from 'redux-actions';
import type {CartItem, NormalizedCart} from './types';

export const fetchCartRequest = createAction(
  Cart.FETCH_REQUEST,
  () => undefined,
);

export const fetchCartSuccess = createAction(
  Cart.FETCH_SUCCESS,
  (normalizedCart: NormalizedCart): NormalizedCart => normalizedCart,
);

export const fetchCartFailure = createAction(
  Cart.FETCH_FAILURE,
  (error: Error): string => error.toString(),
);

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
  (error: Error): string => error.toString(),
);

export type CartActions =
  | ActionType<typeof fetchCartRequest>
  | ActionType<typeof fetchCartSuccess>
  | ActionType<typeof fetchCartFailure>
  | ActionType<typeof updateCartItems>
  | ActionType<typeof updateCartItemsSuccess>
  | ActionType<typeof updateCartItemsFailure>;
