// @flow

const ESTIMATE_SHIPPING: 'estimateShippingMethods' = 'estimateShippingMethods';
const ESTIMATE_SHIPPING_SUCCESS: 'estimateShippingMethodsSuccess' =
  'estimateShippingMethodsSuccess';
const ESTIMATE_SHIPPING_FAILURE: 'estimateShippingMethodsFailure' =
  'estimateShippingMethodsFailure';
const SET_SHIPPING_INFORMATION: 'setShippingInformationRequest' =
  'setShippingInformationRequest';
const SET_SHIPPING_INFORMATION_SUCCESS: 'setShippingInformationSuccess' =
  'setShippingInformationSuccess';
const SET_SHIPPING_INFORMATION_FAILURE: 'setShippingInformationFailure' =
  'setShippingInformationFailure';
const UPDATE_ADDRESS: 'updateShippingAddressRequest' =
  'updateShippingAddressRequest';

export const ActionTypes = {
  ESTIMATE_SHIPPING_FAILURE,
  ESTIMATE_SHIPPING_SUCCESS,
  ESTIMATE_SHIPPING,
  SET_SHIPPING_INFORMATION_FAILURE,
  SET_SHIPPING_INFORMATION_SUCCESS,
  SET_SHIPPING_INFORMATION,
  UPDATE_ADDRESS,
};
