// @flow
import {createAction, type ActionType} from 'redux-actions';
import {PayloadCreators} from '$src/utils/redux';
import {ActionTypes} from './constants';
import type {CustomerInfo, Result} from 'AvardaCheckOutClient';

const {createString, createVoid} = PayloadCreators;

export const updateItems = createAction(ActionTypes.UPDATE_ITEMS, createVoid);

export const fetchPurchaseId = createAction(
  ActionTypes.GET_PURCHASE_ID,
  createVoid,
);

export const receivePurchaseId = createAction(
  ActionTypes.RECEIVE_PURCHASE_ID,
  createString,
);

export const getPurchaseIdFailure = createAction(
  ActionTypes.GET_PURCHASE_ID_FAILURE,
);

export const addressChanged = createAction(
  ActionTypes.ADDRESS_CHANGED,
  (result: Result, info: CustomerInfo): * => ({
    result,
    info,
  }),
);

export const completePaymentPressed = createAction(
  ActionTypes.COMPLETE_PAYMENT_PRESSED,
  (result: Result, purchaseId: string) => ({
    result,
    purchaseId,
  }),
);

export const updatedItems = createAction(ActionTypes.UPDATED_ITEMS, createVoid);

export type AvardaActions =
  | ActionType<typeof fetchPurchaseId>
  | ActionType<typeof receivePurchaseId>
  | ActionType<typeof addressChanged>
  | ActionType<typeof completePaymentPressed>
  | ActionType<typeof updatedItems>
  | ActionType<typeof updateItems>;
