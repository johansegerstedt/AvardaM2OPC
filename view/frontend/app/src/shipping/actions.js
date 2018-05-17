// @flow
import {createAction, type ActionType} from 'redux-actions';
import uuid from 'uuid/v4';
import {PayloadCreators} from '$src/utils/redux';
import {ActionTypes} from './constants';
import type {BillingAddress} from '$src/cart/types';
import type {Message, MessageState} from '$src/utils/types';
import type {ShippingMethod} from './types';

const {createError, createVoid} = PayloadCreators;

export const addMessage = createAction(
  ActionTypes.ADD_MESSAGE,
  (message: Message): MessageState => ({
    ...message,
    id: uuid(),
  }),
);

export const clearMessages = createAction(
  ActionTypes.CLEAR_MESSAGES,
  createVoid,
);

export const receiveSelectedMethod = createAction(
  ActionTypes.RECEIVE_SELECTED_METHOD,
  (method: ShippingMethod) => method,
);

export const receiveShippingAssignment = createAction(
  ActionTypes.RECEIVE_ASSIGNMENT,
  (shipping: {address: BillingAddress, method: null | string}) => shipping,
);

export const getMethods = createAction(
  ActionTypes.GET_METHODS_REQUEST,
  createVoid,
);

export const receiveMethodsSuccess = createAction(
  ActionTypes.RECEIVE_METHODS_SUCCESS,
  (methods: ShippingMethod[]) => methods,
);

export const receiveMethodsFailure = createAction(
  ActionTypes.RECEIVE_METHODS_FAILURE,
  createError,
);

export const saveShippingInformation = createAction(
  ActionTypes.SAVE_SHIPPING_INFORMATION,
  (addressInformation: {
    shipping_address: BillingAddress,
    shipping_carrier_code: string,
    shipping_method_code: string,
  }) => addressInformation,
);

export const saveShippingInformationSuccess = createAction(
  ActionTypes.SAVE_SHIPPING_INFORMATION_SUCCESS,
  createVoid,
);

export const saveShippingInformationFailure = createAction(
  ActionTypes.SAVE_SHIPPING_INFORMATION_FAILURE,
  createError,
);

export const scrollToForm = createAction(
  ActionTypes.SCROLL_TO_FORM,
  createVoid,
);

export const selectMethod = createAction(
  ActionTypes.SELECT_METHOD,
  (method: ShippingMethod) => method,
);

export const updateAddress = createAction(
  ActionTypes.UPDATE_ADDRESS,
  (address: BillingAddress) => address,
);

export type ShippingActions =
  | ActionType<typeof addMessage>
  | ActionType<typeof clearMessages>
  | ActionType<typeof getMethods>
  | ActionType<typeof receiveMethods>
  | ActionType<typeof receiveSelectedMethod>
  | ActionType<typeof receiveShippingAssignment>
  | ActionType<typeof saveShippingInformation>
  | ActionType<typeof saveShippingInformationFailure>
  | ActionType<typeof saveShippingInformationSuccess>
  | ActionType<typeof scrollToForm>
  | ActionType<typeof selectMethod>
  | ActionType<typeof updateAddress>;
//  ActionType<typeof

/*
export const estimateShippingMethodsRequest = createAction(
  ActionTypes.GET_METHODS,
  (payload: {address: BillingAddress, methodValue: string}) => payload,
);

export const updateShippingAddressRequest = createAction(
  ActionTypes.UPDATE_ADDRESS,
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

export const focusShippingContainer = createAction(
  ActionTypes.SCROLL_TO_FORM,
  createVoid,
);

export const addMessage = createAction(
  ActionTypes.ADD_MESSAGE,
  (message: Message) => ({
    ...message,
    id: uuid(),
  }),
);
*/
