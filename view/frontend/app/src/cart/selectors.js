// @flow
import {createSelector} from 'reselect';
import {flowRight as compose, values} from 'lodash';
import type {Selector} from '$src/root/types';
import type {CartItem} from './types';

export const getCartItems: Selector<void, *> = state => state.cartItems.byId;

export const getAllCartItems: Selector<void, CartItem[]> = compose([
  values,
  getCartItems,
]);

export const getCartItemById = (id: string) =>
  createSelector(getCartItems, byId => byId !== null && byId[id]);

export const makeGetCartItemById = () => {
  const selectCartItemId: Selector<{cartItemId: string}, string> = (
    state,
    {cartItemId},
  ) => cartItemId;

  return createSelector(
    selectCartItemId,
    getCartItems,
    (cartItemId, byId) => byId && byId[cartItemId],
  );
};

export const getCart: Selector<void, *> = state => state.cart.data;
