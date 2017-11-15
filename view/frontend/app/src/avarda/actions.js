// @flow
import {createAction, type ActionType} from 'redux-actions';
import {PayloadCreators} from '$src/utils/redux';
import {ActionTypes} from './constants';

const {createString, createVoid} = PayloadCreators;

export const fetchPurchaseId = createAction(
  ActionTypes.GET_PURCHASE_ID,
  createVoid,
);

export const receivePurchaseId = createAction(
  ActionTypes.RECEIVE_PURCHASE_ID,
  createString,
);

export type AvardaActions =
  | ActionType<typeof fetchPurchaseId>
  | ActionType<typeof receivePurchaseId>;
