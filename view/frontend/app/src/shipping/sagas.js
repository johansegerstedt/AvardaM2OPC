// @flow
import $ from 'jquery';
import _mageTranslate from 'mage/translate'; // eslint-disable-line no-unused-vars
import {takeLatest} from 'redux-saga';
import {call, put, select} from 'redux-saga/effects';
import {find, head} from 'lodash';
import {MessageTypes} from '$src/utils/components/Message';
import {apiPost, getApiUrl} from '$src/m2api';
import {getCartApiPath} from '$src/cart/utils';
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
  saveShippingInformation,
  saveShippingInformationSuccess,
  selectMethod as selectMethodAction,
  updateAddress as updateAddressAction,
} from './actions';
import {getAddress} from './selectors';
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

function* updateAddress() {
  yield put(getMethodsAction());
}

function* getMethods() {
  const address = yield select(getAddress);
  const methods = yield call(apiFetchShippingMethods, address);
  yield put(receiveMethods(methods));
}

function* selectMethod({
  payload: method,
}: ActionType<typeof selectMethodAction>) {
  const shipping_address = yield select(getAddress);
  if (!method.available) {
    return yield put(
      addMessage({
        type: MessageTypes.ERROR,
        message: $.mage.__('Invalid shipping method'),
      }),
    );
  }
  const {
    carrier_code: shipping_carrier_code,
    method_code: shipping_method_code,
  } = method;

  yield put(
    saveShippingInformation({
      shipping_address,
      shipping_carrier_code,
      shipping_method_code,
    }),
  );
}

function* saveInformation({
  payload: addressInformation,
}: ActionType<typeof saveShippingInformation>) {
  yield call(apiPost, getApiUrl(`${getCartApiPath()}/shipping-information`), {
    addressInformation,
  });
  yield put(saveShippingInformationSuccess());
}
/*
function* updateShippingAddress({
  payload: address,
}: ActionType<typeof updateShippingAddressRequest>) {
  try {
    const methods = yield call(apiFetchShippingMethods, address);
    const selectedMethod = yield select(getSelectedMethod);

    const selectedMethodIsStillValid = methods.some(method =>
      isEqual(method, selectedMethod),
    );
    const firstAvailableMethod = find(methods, {available: true});
    const methodToUpdateAddress = selectedMethodIsStillValid
      ? selectedMethod
      : firstAvailableMethod;

    if (typeof methodToUpdateAddress !== 'undefined') {
      yield setShippingInformation(
        setShippingInformationRequest({
          shipping_address: address,
          shipping_method: methodToUpdateAddress,
        }),
      );
    }

    yield put(estimateShippingMethodsSuccess(methods));
  } catch (err) {
    yield put(estimateShippingMethodsFailure(err));
  }
}

function* setShippingInformation({
  payload: {shipping_address, shipping_method},
}: ActionType<typeof setShippingInformationRequest>) {
  if (!shipping_method.available) {
    throw new Error(
      'Shipping method is not available.\n' + JSON.stringify(shipping_method),
    );
  }

  const url = `${getApiUrl(`${getCartApiPath()}/shipping-information`)}`;
  const addressInformation = {
    shipping_address,
    shipping_carrier_code: shipping_method.carrier_code,
    shipping_method_code: shipping_method.method_code,
  };
  try {
    yield call(apiPost, url, {addressInformation});
    const cart = yield call(apiFetchCart);
    yield put(setShippingInformationSuccess(shipping_method));
    yield put(fetchCartSuccessAction(cart));
  } catch (err) {
    yield put(setShippingInformationFailure(err));
  }
}
*/
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
