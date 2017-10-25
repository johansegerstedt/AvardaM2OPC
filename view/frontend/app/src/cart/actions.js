// @flow
import {createAction} from 'redux-actions';
import {ActionTypes as Cart} from './constants';
import type {ActionType} from 'redux-actions';
import type {NormalizedCart} from './types';

export const fetchCartRequest = createAction(
  Cart.FETCH_REQUEST,
  () => undefined,
);

export const fetchCartSuccess = createAction(
  Cart.FETCH_SUCCESS,
  (normalizedCart: NormalizedCart) => normalizedCart,
);

export const fetchCartFailure = createAction(
  Cart.FETCH_FAILURE,
  (error: Error) => {
    error.toString();
  },
);

export type CartActions =
  | ActionType<fetchCartRequest>
  | ActionType<fetchCartSuccess>
  | ActionType<fetchCartFailure>;
