// @flow
import type {Selector} from '$src/root/types';

export const getShippingMethods: Selector<void, *> = state =>
  state.shippingMethods.methods;

export const getIsFetchingShippingMethods: Selector<void, boolean> = state =>
  state.shippingMethods.isFetching;

export const getSelectedMethod: Selector<void, *> = state =>
  state.shippingMethods.selectedMethod;
