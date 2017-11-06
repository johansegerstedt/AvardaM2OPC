// @flow
import type {Selector} from '$src/root/types';

export const getShippingMethods: Selector<void, *> = state =>
  state.shippingMethods.methods;
