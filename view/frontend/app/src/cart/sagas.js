// @flow
import {takeLatest} from 'redux-saga';
import {all, fork, put} from 'redux-saga/effects';
import {normalize} from 'normalizr';
import {merge} from 'lodash';
import {fetchCartSuccess, fetchCartFailure} from './actions';
import {ActionTypes as Cart, cartSchema} from './constants';
import {getApiUrl, apiGet} from '$src/m2api';
import config from '$src/config';

function* fetchCart() {
  const url = getApiUrl(
    config.maskedQuoteId
      ? `/V1/guest-carts/${config.maskedQuoteId}`
      : '/V1/carts/mine',
  );

  try {
    const [cart, totals] = yield Promise.all([
      apiGet(url),
      apiGet(`${url}/totals`),
    ]);
    const data = merge({}, cart, totals);
    yield put(fetchCartSuccess(normalize(data, cartSchema)));
  } catch (err) {
    yield put(fetchCartFailure(err.toString()));
  }
}

export default function* saga(): Generator<*, *, *> {
  yield all([
    yield fork(function*() {
      yield takeLatest(Cart.FETCH_REQUEST, fetchCart);
    }),
  ]);
}
