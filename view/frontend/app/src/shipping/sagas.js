// @flow
import {takeLatest} from 'redux-saga';
import {all, fork, put} from 'redux-saga/effects';
import {apiPost, getApiUrl} from '$src/m2api';
import {getCartApiPath} from '$src/cart/utils';
import {ActionTypes as Shipping} from './constants';
import {
  estimateShippingMethodsRequest,
  estimateShippingMethodsSuccess,
  estimateShippingMethodsFailure,
} from './actions';
import type {ActionType} from 'redux-actions';

function* estimateShippingMethods({
  payload: address,
}: ActionType<typeof estimateShippingMethodsRequest>) {
  const url = `${getApiUrl(getCartApiPath())}/estimate-shipping-methods`;
  try {
    const methods = yield apiPost(url, {address});

    yield put(estimateShippingMethodsSuccess(methods));
  } catch (err) {
    yield put(estimateShippingMethodsFailure(err));
  }
}

export default function* saga(): Generator<*, *, *> {
  yield all([
    yield fork(function* watchEstimateShipping() {
      yield takeLatest(Shipping.ESTIMATE_SHIPPING, estimateShippingMethods);
    }),
  ]);
}
