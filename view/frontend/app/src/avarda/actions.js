// @flow
import {createAction, type ActionType} from 'redux-actions';
import {PayloadCreators} from '$src/utils/redux';
import {ActionTypes} from './constants';
import type {CustomerInfo, Result} from 'AvardaCheckOutClient';

const {createString, createVoid} = PayloadCreators;

export const fetchPurchaseId = createAction(
  ActionTypes.GET_PURCHASE_ID,
  createVoid,
);

export const receivePurchaseId = createAction(
  ActionTypes.RECEIVE_PURCHASE_ID,
  createString,
);

export const addressChanged = createAction(
  ActionTypes.ADDRESS_CHANGED,
  (result: Result, info: CustomerInfo): * => ({
    result,
    info,
  }),
);

export const updatedItems = createAction(ActionTypes.UPDATED_ITEMS, createVoid);

export type AvardaActions =
  | ActionType<typeof fetchPurchaseId>
  | ActionType<typeof receivePurchaseId>
  | ActionType<typeof addressChanged>
  | ActionType<typeof updatedItems>;