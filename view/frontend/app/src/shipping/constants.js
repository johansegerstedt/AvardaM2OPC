// @flow

export const ActionTypes = {
  ADD_MESSAGE: 'shipping/addMessage',
  CLEAR_MESSAGES: 'shipping/clearMessages',
  GET_METHODS_REQUEST: 'shipping/getMethodsRequest',
  GET_METHODS_SUCCESS: 'shipping/getMethodsSuccess',
  GET_METHODS_FAILURE: 'shipping/getMethodsFailure',
  RECEIVE_ASSIGNMENT: 'shipping/receiveShippingAssignment',
  RECEIVE_METHODS: 'shipping/receiveMethodsRequest',
  RECEIVE_METHODS_SUCCESS: 'shipping/receiveMethodsSuccess',
  RECEIVE_METHODS_FAILURE: 'shipping/receiveMethodsFailure',
  RECEIVE_SELECTED_METHOD: 'shipping/receiveSelectedMethod',
  SAVE_SHIPPING_INFORMATION: 'shipping/saveInformation',
  SAVE_SHIPPING_INFORMATION_SUCCESS: 'shipping/saveInformationSuccess',
  SAVE_SHIPPING_INFORMATION_FAILURE: 'shipping/saveInformationFailure',
  SCROLL_TO_FORM: 'shipping/scrollToForm',
  UPDATE_ADDRESS: 'shipping/updateAddress',
  SELECT_METHOD: 'shipping/selectMethod',
};

export const SHIPPING_ANCHOR_ID = 'avarda-check-out_shipping-method-form';
