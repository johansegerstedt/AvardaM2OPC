// @flow
import {createAction, type ActionType} from 'redux-actions';
import {PayloadCreators} from '$src/utils/redux';
import {ActionTypes} from './constants';
import type {BillingAddress} from '$src/cart/types';
import type {ShippingMethod} from './types';

const {createError} = PayloadCreators;

export const estimateShippingMethodsRequest = createAction(
  ActionTypes.ESTIMATE_SHIPPING,
  (address: BillingAddress): BillingAddress => address,
);

export const estimateShippingMethodsSuccess = createAction(
  ActionTypes.ESTIMATE_SHIPPING_SUCCESS,
  (methods: ShippingMethod[]): ShippingMethod[] => methods,
);

export const estimateShippingMethodsFailure = createAction(
  ActionTypes.ESTIMATE_SHIPPING_FAILURE,
  createError,
);

export const setShippingInformationRequest = createAction(
  ActionTypes.SET_SHIPPING_INFORMATION,
  (payload: {
    shipping_address: BillingAddress,
    shipping_method: ShippingMethod,
  }) => payload,
);

export const setShippingInformationSuccess = createAction(
  ActionTypes.SET_SHIPPING_INFORMATION_SUCCESS,
  (shippingMethod: ShippingMethod): ShippingMethod => shippingMethod,
);

export const setShippingInformationFailure = createAction(
  ActionTypes.SET_SHIPPING_INFORMATION_FAILURE,
  createError,
);

export type ShippingActions =
  | ActionType<typeof estimateShippingMethodsRequest>
  | ActionType<typeof estimateShippingMethodsSuccess>
  | ActionType<typeof estimateShippingMethodsFailure>
  | ActionType<typeof setShippingInformationRequest>
  | ActionType<typeof setShippingInformationSuccess>
  | ActionType<typeof setShippingInformationFailure>;
