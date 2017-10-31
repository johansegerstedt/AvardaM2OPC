// @flow
import {takeEvery, takeLatest} from 'redux-saga';
import {all, fork, put} from 'redux-saga/effects';
import {normalize} from 'normalizr';
import {merge} from 'lodash';
import {getCartApiPath} from './utils';
import {
  fetchCartRequest,
  fetchCartSuccess,
  fetchCartFailure,
  updateCartItemsSuccess,
  updateCartItemsFailure,
  deleteCartItem as deleteCartItemCreator,
  deleteCartItemSuccess,
  deleteCartItemFailure,
  applyCoupon as applyCouponRequest,
  applyCouponSuccess,
  applyCouponFailure,
  removeCouponSuccess,
  removeCouponFailure,
} from './actions';
import {ActionTypes as Cart, cartSchema} from './constants';
import {getApiUrl, apiDelete, apiGet, apiPut} from '$src/m2api';
import config from '$src/config';
import type {ActionType} from 'redux-actions';

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
    yield put(fetchCartRequest());
  } catch (err) {
    yield put(updateCartItemsFailure(err));
  }
}

function* deleteCartItem({
  payload: itemId,
}: ActionType<typeof deleteCartItemCreator>) {
  const baseUrl = getApiUrl(getCartApiPath());
  const url = `${baseUrl}/items/${itemId}`;
  try {
    const data = yield apiDelete(url);
    const deleteSuccess = data === true;
    if (!deleteSuccess) {
      throw new Error(`Couldn't delete item ${itemId}.`);
    }
    yield put(deleteCartItemSuccess(itemId));
    yield put(fetchCartRequest());
  } catch (err) {
    yield put(deleteCartItemFailure(err));
  }
}

function* applyCoupon({
  payload: couponCode,
}: ActionType<typeof applyCouponRequest>) {
  const url = getApiUrl(`${getCartApiPath()}/coupons/${couponCode}`);
  try {
    const success = yield apiPut(url);
    if (success !== true) {
      throw new Error(`Couldn't apply coupon "${couponCode}"`);
    }
    yield put(applyCouponSuccess(couponCode));
    yield put(fetchCartRequest());
  } catch (err) {
    yield put(applyCouponFailure(err));
  }
}

function* removeCoupon() {
  const url = getApiUrl(`${getCartApiPath()}/coupons`);
  try {
    const success = yield apiDelete(url);
    if (success !== true) {
      throw new Error(`Couldn't remove coupon.`);
    }
    yield put(removeCouponSuccess());
    yield put(fetchCartRequest());
  } catch (err) {
    yield put(removeCouponFailure(err));
  }
}

export default function* saga(): Generator<*, *, *> {
  yield all([
    yield fork(function* watchFetchCart() {
      yield takeLatest(Cart.FETCH_REQUEST, fetchCart);
    }),
    yield fork(function* watchUpdateItems() {
      yield takeLatest(Cart.UPDATE_ITEMS_REQUEST, updateCartItems);
    }),
    yield fork(function* watchDeleteItem() {
      yield takeEvery(Cart.DELETE_ITEM_REQUEST, deleteCartItem);
    }),
    yield fork(function* watchApplyCoupon() {
      yield takeEvery(Cart.APPLY_COUPON_REQUEST, applyCoupon);
    }),
    yield fork(function* watchRemoveCoupon() {
      yield takeLatest(Cart.REMOVE_COUPON_REQUEST, removeCoupon);
    }),
  ]);
}
