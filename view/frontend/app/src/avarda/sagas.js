// @flow
import {takeLatest} from 'redux-saga';
import {all, call, fork, put} from 'redux-saga/effects';
import {apiGet, getApiUrl} from '$src/m2api';
import {getCartApiPath} from '$src/cart/utils';
import {receivePurchaseId} from './actions';
import {ActionTypes} from './constants';

function* fetchPurchaseId() {
  try {
    const {purchase_id} = yield call(
      apiGet,
      getApiUrl(`${getCartApiPath()}/avarda-payment`),
    );
    yield put(receivePurchaseId(purchase_id));
  } catch (err) {
    // TODO
    throw err;
  }
}

export default function*(): Generator<*, *, *> {
  yield all([
    yield fork(function* watchFetchPurchaseId() {
      yield takeLatest(ActionTypes.GET_PURCHASE_ID, fetchPurchaseId);
    }),
  ]);
}
