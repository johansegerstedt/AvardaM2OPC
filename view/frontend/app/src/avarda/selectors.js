// @flow
import {createSelector} from 'reselect';
import type {Selector} from '$src/root/types';
import type {AvardaState} from './types';

export const getAvardaState: Selector<void, AvardaState> = state =>
  state.avarda;

export const getPurchaseId: Selector<void, *> = createSelector(
  [getAvardaState],
  ({purchaseId}) => purchaseId,
);

export const getIsFetching: Selector<void, boolean> = createSelector(
  [getAvardaState],
  ({isFetching}) => isFetching,
);
