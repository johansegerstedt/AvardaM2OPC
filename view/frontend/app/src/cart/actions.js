// @flow
import {createAction} from 'redux-actions';
import {ActionTypes as Cart} from './constants';

export const fetchCartRequest = () => createAction(Cart.FETCH_REQUEST)();

export const fetchCartSuccess = (normalizedCart: {id: string}) =>
  createAction(Cart.FETCH_SUCCESS)(normalizedCart);

export const fetchCartFailure = (error: Error) =>
  createAction(Cart.FETCH_FAILURE)({error});
