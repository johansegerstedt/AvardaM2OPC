// @flow
import $ from 'jquery';
import _mageTranslate from 'mage/translate'; // eslint-disable-line no-unused-vars
import {takeLatest} from 'redux-saga';
import {call, put} from 'redux-saga/effects';
import {find, head, isEqual} from 'lodash';
import quote from 'Magento_Checkout/js/model/quote';
import newCustomerAddress from 'Magento_Checkout/js/model/new-customer-address';
import selectShippingAddress from 'Magento_Checkout/js/action/select-shipping-address';
import selectShippingMethod from 'Magento_Checkout/js/action/select-shipping-method';
import setShippingInformation from 'Magento_Checkout/js/action/set-shipping-information';
import {MessageTypes} from '$src/utils/components/Message';
import {ActionTypes as Shipping} from './constants';
import {ActionTypes as Cart} from '$src/cart/constants';
import {fetchCartSuccess as fetchCartSuccessAction} from '$src/cart/actions';
import {refreshCart} from '$src/cart/sagas';
import {
  addMessage,
  getMethods as getMethodsAction,
  receiveSelectedMethod,
  receiveShippingAssignment,
  receiveMethods,
  saveShippingInformationSuccess,
  selectMethod as selectMethodAction,
  updateAddress as updateAddressAction,
} from './actions';
import {fetchShippingMethods as apiFetchShippingMethods} from './api';
import {SHIPPING_ANCHOR_ID} from './constants';
import type {ActionType} from 'redux-actions';

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
    const methods = yield call(apiFetchShippingMethods, address);
    const [carrier_code, method_code] = method.split('_');
    const selectedMethod = find(methods, {carrier_code, method_code});
    if (selectedMethod) {
      yield put(receiveSelectedMethod(selectedMethod));
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
  selectShippingAddress(newCustomerAddress(emptyStreetFix(address)));
  yield put(getMethodsAction());
}

function* getMethods() {
  const address = yield call([quote, quote.shippingAddress]);
  const methods = yield call(apiFetchShippingMethods, address);
  yield put(receiveMethods(methods));
}

function* selectMethod({
  payload: method,
}: ActionType<typeof selectMethodAction>) {
  if (!method.available) {
    return yield put(
      addMessage({
        type: MessageTypes.ERROR,
        message: $.mage.__('Invalid shipping method'),
      }),
    );
  }

  selectShippingMethod(method);
  // yield put(
  //   saveShippingInformation({
  //     shipping_address,
  //     shipping_carrier_code,
  //     shipping_method_code,
  //   }),
  // );
}

function* saveInformation() {
  setShippingInformation();
  yield put(saveShippingInformationSuccess());
}

function* scrollToShippingContainer() {
  const element = document.getElementById(SHIPPING_ANCHOR_ID);
  if (element) {
    yield call([element, element.scrollIntoView]);
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(Cart.FETCH_SUCCESS, fetchCartSuccess);
  yield takeLatest(Shipping.GET_METHODS, getMethods);
  yield takeLatest(Shipping.RECEIVE_ASSIGNMENT, receiveShipping);
  yield takeLatest(Shipping.SCROLL_TO_FORM, scrollToShippingContainer);
  yield takeLatest(Shipping.UPDATE_ADDRESS, updateAddress);
  yield takeLatest(Shipping.SAVE_SHIPPING_INFORMATION, saveInformation);
  yield takeLatest(Shipping.SAVE_SHIPPING_INFORMATION_SUCCESS, refreshCart);
  yield takeLatest(Shipping.SELECT_METHOD, selectMethod);
}
