// @flow
import {takeLatest} from 'redux-saga';
import {all, fork, put} from 'redux-saga/effects';
import {normalize} from 'normalizr';
import {merge} from 'lodash';
import {getCartApiPath} from './utils';
import {
  fetchCartSuccess,
  fetchCartFailure,
  updateCartItemsSuccess,
  updateCartItemsFailure,
} from './actions';
import {ActionTypes as Cart, cartSchema} from './constants';
import {getApiUrl, apiGet, apiPut} from '$src/m2api';
import config from '$src/config';

function* fetchCart() {
  const url = getApiUrl(getCartApiPath());

  try {
    const [cart, totals] = yield Promise.all([
      apiGet(url),
      apiGet(`${url}/totals`),
    ]);
    const data = merge({}, cart, totals);
    yield put(fetchCartSuccess(normalize(data, cartSchema)));
  } catch (err) {
    yield put(fetchCartFailure(err));
  }
}

function* updateCartItems(
  {payload = []}: {payload: any[]} = {},
): Generator<*, *, *> {
  const baseUrl = getApiUrl(getCartApiPath());
  try {
    const updatedItems = yield Promise.all(
      payload.map(({item_id, quote_id, sku, qty}) =>
        apiPut(`${baseUrl}/items/${item_id}`, {
          cartItem: {
            item_id,
            quote_id: config.maskedQuoteId || quote_id,
            sku,
            qty,
          },
        }),
      ),
    );

    yield put(updateCartItemsSuccess(updatedItems));
  } catch (err) {
    yield put(updateCartItemsFailure(err));
  }
}

export default function* saga(): Generator<*, *, *> {
  yield all([
    yield fork(function*() {
      yield takeLatest(Cart.FETCH_REQUEST, fetchCart);
    }),
    yield fork(function*() {
      yield takeLatest(Cart.UPDATE_ITEMS_REQUEST, updateCartItems);
    }),
  ]);
}
