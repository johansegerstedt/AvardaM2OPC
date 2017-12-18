// @flow
import {createSelector} from 'reselect';
import {compose} from 'redux';
import {values} from 'lodash';
import type {Selector} from '$src/root/types';
import type {BillingAddress, CartItem} from './types';

export const getCartItems: Selector<void, *> = state => state.cartItems.byId;

export const getAllCartItems: Selector<void, CartItem[]> = compose(
  values,
  getCartItems,
);

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
export const getIsCartUpdating: Selector<void, boolean> = state =>
  state.cart.pendingUpdates !== 0;

export const getIsCartFetching: Selector<void, *> = state =>
  state.cart.isFetching;

export const getShippingAssignment: Selector<void, *> = createSelector(
  [getCart],
  cart => {
    if (
      cart === null ||
      typeof cart.extension_attributes.shipping_assignments === 'undefined' ||
      cart.extension_attributes.shipping_assignments.length === 0
    ) {
      return null;
    }
    return cart.extension_attributes.shipping_assignments[0];
  },
);

export const getShippingAddress: Selector<
  void,
  null | BillingAddress,
> = createSelector(
  [getShippingAssignment],
  assignment => assignment && assignment.shipping.address,
);

export const getSelectedShippingMethodValue: Selector<
  void,
  null | string,
> = createSelector(
  [getShippingAssignment],
  assignment => assignment && assignment.shipping.method,
);

export const getQuoteCurrency: Selector<void, *> = createSelector(
  [getCart],
  cart => cart && cart.currency.quote_currency_code,
);

export const getIsVirtual: Selector<void, boolean> = createSelector(
  [getCart],
  cart => Boolean(cart && cart.is_virtual),
);
