// @flow
import {takeLatest} from 'redux-saga';
import {all, call, fork, put, select} from 'redux-saga/effects';
import {find, isEqual} from 'lodash';
import {apiPost, getApiUrl} from '$src/m2api';
import {getCartApiPath} from '$src/cart/utils';
import {ActionTypes as Shipping} from './constants';
import {fetchCart as apiFetchCart} from '$src/cart/api';
import {fetchCartSuccess} from '$src/cart/actions';
import {
  estimateShippingMethodsRequest,
  estimateShippingMethodsSuccess,
  estimateShippingMethodsFailure,
  setShippingInformationRequest,
  setShippingInformationSuccess,
  setShippingInformationFailure,
} from './actions';
import {getSelectedMethod} from './selectors';
import type {ActionType} from 'redux-actions';

function* estimateShippingMethods({
  payload: address,
}: ActionType<typeof estimateShippingMethodsRequest>) {
  const url = `${getApiUrl(getCartApiPath())}/estimate-shipping-methods`;
  try {
    const methods = yield call(apiPost, url, {address});
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
    yield put(fetchCartSuccess(cart));
  } catch (err) {
    yield put(setShippingInformationFailure(err));
  }
}

export default function* saga(): Generator<*, *, *> {
  yield all([
    yield fork(function* watchEstimateShipping() {
      yield takeLatest(Shipping.ESTIMATE_SHIPPING, estimateShippingMethods);
    }),
    yield fork(function* watchSetShipping() {
      yield takeLatest(
        Shipping.SET_SHIPPING_INFORMATION,
        setShippingInformation,
      );
    }),
  ]);
}
