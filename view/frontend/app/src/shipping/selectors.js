// @flow
import {createSelector} from 'reselect';
import type {Selector} from '$src/root/types';

export const getShippingMethodState: Selector<void, *> = state =>
  state.shippingMethods;

export const getShippingMethods: Selector<void, *> = createSelector(
  [getShippingMethodState],
  ({methods}) => methods,
);

export const getIsFetchingShippingMethods: Selector<
  void,
  boolean,
> = createSelector([getShippingMethodState], ({isFetching}) => isFetching);

export const getIsUpdatingShippingMethods: Selector<
  void,
  boolean,
> = createSelector([getShippingMethodState], ({isSelecting}) => isSelecting);

export const getSelectedMethod: Selector<void, *> = createSelector(
  [getShippingMethodState],
  ({selectedMethod}) => selectedMethod,
);

export const getMessages: Selector<void, *> = createSelector(
  [getShippingMethodState],
  ({messages}) => messages,
);
