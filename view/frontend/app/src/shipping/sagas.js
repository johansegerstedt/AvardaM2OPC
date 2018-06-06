// @flow
import {$} from '$i18n';
import {type Saga} from 'redux-saga';
import {call, put, takeLatest} from 'redux-saga/effects';
import find from 'lodash/find';
import head from 'lodash/head';
import isEqual from 'lodash/isEqual';
import type {ActionType} from 'redux-actions';
// The following actions and models are used to keep
// Magento UI components up to date with updated state
import quote from 'Magento_Checkout/js/model/quote';
import newCustomerAddress from 'Magento_Checkout/js/model/new-customer-address';
import selectShippingAddress from 'Magento_Checkout/js/action/select-shipping-address';
import selectShippingMethod from 'Magento_Checkout/js/action/select-shipping-method';
import setShippingInformation from 'Magento_Checkout/js/action/set-shipping-information';

import {MessageTypes} from '$src/utils/components/Message';
import toast, {TYPES} from '$src/utils/toast';
import {ActionTypes as Shipping} from './constants';
import {
  fetchCartSuccess as fetchCartSuccessAction,
  FETCH_SUCCESS,
} from '$src/cart/actions';
import {refreshCart} from '$src/cart/sagas';
import {
  addMessage,
  getMethods as getMethodsAction,
  receiveShippingAssignment,
  saveShippingInformationFailure,
  saveShippingInformationSuccess,
  selectMethod as selectMethodAction,
  updateAddress as updateAddressAction,
  receiveMethodsFailure,
  receiveMethodsSuccess,
} from './actions';
import {fetchShippingMethods as apiFetchShippingMethods} from './api';
import {SHIPPING_ANCHOR_ID} from './constants';

function* fetchCartSuccess({
  payload: {result, entities},
}: ActionType<typeof fetchCartSuccessAction>) {
  const cart = entities.cart[result.toString()];
  const shippingAssignment: void | * = head(
    cart.extension_attributes.shipping_assignments,
  );
  if (shippingAssignment) {
    yield put(receiveShippingAssignment(shippingAssignment.shipping));
  }
}

function* receiveShipping({
  payload: {address, method},
}: ActionType<typeof receiveShippingAssignment>) {
  yield put(updateAddressAction(address));
  if (method) {
    let methods = null;
    try {
      methods = yield call(apiFetchShippingMethods, address);
    } catch (err) {
      toast(
        $.mage.__('Failed to load available shipping methods.'),
        TYPES.ERROR,
      );
      return;
    }
    const [carrier_code, method_code] = method.split('_');
    const selectedMethod = find(methods, {carrier_code, method_code});
    if (selectedMethod) {
      // Update the shipping method to quote model
      yield call([quote, quote.shippingMethod], selectedMethod);
    }
  }
}

function* updateAddress({payload: address}) {
  const emptyStreetFix = (obj: {street?: ?(string[])} = {}) => {
    const result = {...obj};
    if (
      result.street &&
      (result.street.length === 0 || isEqual([''], result.street))
    ) {
      result.street = undefined;
    }
    return result;
  };
  // Update shipping address to quote model
  quote.shippingAddress(newCustomerAddress(emptyStreetFix(address)));
  selectShippingAddress(quote.shippingAddress());
  if (address && address.postcode) {
    yield put(getMethodsAction());
  }
}

function* getMethods() {
  const address = yield call([quote, quote.shippingAddress]);
  let methods = null;
  try {
    methods = yield call(apiFetchShippingMethods, address);
    yield put(receiveMethodsSuccess(methods));
    // console.log(methods);
    // yield selectMethod({payload: methods[0]});
  } catch (err) {
    toast($.mage.__('Failed to load available shipping methods.'), TYPES.ERROR);
    yield put(receiveMethodsFailure(err));
  }
}

function* selectMethod({
  payload: method,
}: ActionType<typeof selectMethodAction>) {
  // console.log(method);
  if (!method.available) {
    return yield put(
      addMessage({
        type: MessageTypes.ERROR,
        message: $.mage.__('Invalid shipping method'),
      }),
    );
  }

  try {
    selectShippingMethod(method);
    setShippingInformation();
    yield put(saveShippingInformationSuccess());
  } catch (err) {
    toast($.mage.__('Failed to save shipping information.'), TYPES.ERROR);
    yield put(saveShippingInformationFailure(err));
  }
}

function* saveInformation() {
  try {
    setShippingInformation();
    yield put(saveShippingInformationSuccess());
  } catch (err) {
    toast($.mage.__('Failed to save shipping information.'), TYPES.ERROR);
    yield put(saveShippingInformationFailure(err));
  }
}

function* scrollToShippingContainer() {
  const element = document.getElementById(SHIPPING_ANCHOR_ID);
  if (element) {
    yield call([element, element.scrollIntoView]);
  }
}

export default function* saga(): Saga<*> {
  yield takeLatest(FETCH_SUCCESS, fetchCartSuccess);
  yield takeLatest(Shipping.GET_METHODS_REQUEST, getMethods);
  yield takeLatest(Shipping.RECEIVE_ASSIGNMENT, receiveShipping);
  yield takeLatest(Shipping.SCROLL_TO_FORM, scrollToShippingContainer);
  yield takeLatest(Shipping.UPDATE_ADDRESS, updateAddress);
  yield takeLatest(Shipping.SAVE_SHIPPING_INFORMATION, saveInformation);
  yield takeLatest(Shipping.SAVE_SHIPPING_INFORMATION_SUCCESS, refreshCart);
  yield takeLatest(Shipping.SELECT_METHOD, selectMethod);
}
