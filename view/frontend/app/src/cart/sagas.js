// @flow
import {takeEvery, takeLatest} from 'redux-saga';
import {all, call, fork, put} from 'redux-saga/effects';
import AvardaCheckOutClient from 'AvardaCheckOutClient';
import AvardaCheckOut from '$src/avarda/components/AvardaCheckOut';
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
import {fetchCart as apiFetchCart} from './api';
import {ActionTypes as Cart} from './constants';
import {getApiUrl, apiDelete, apiGet, apiPut} from '$src/m2api';
import {getConfig} from '$src/config';
import type {ActionType} from 'redux-actions';

function* fetchCart() {
  try {
    const cart = yield call(apiFetchCart);
    yield put(fetchCartSuccess(cart));
  } catch (err) {
    yield put(fetchCartFailure(err));
  }
}

function* updateCartItems(
  {payload = []}: {payload: any[]} = {},
): Generator<*, *, *> {
  const baseUrl = `${getCartApiPath()}/items`;
  try {
    const updatedItems = yield all(
      payload.map(({item_id, quote_id, sku, qty}) =>
        call(apiPut, getApiUrl(`${baseUrl}/${item_id}`), {
          cartItem: {
            item_id,
            quote_id: getConfig().maskedQuoteId || quote_id,
            sku,
            qty,
          },
        }),
      ),
    );

    const cart = yield call(apiFetchCart);

    yield put(updateCartItemsSuccess(updatedItems));
    yield put(fetchCartSuccess(cart));
  } catch (err) {
    yield put(updateCartItemsFailure(err));
  }
}

function* deleteCartItem({
  payload: itemId,
}: ActionType<typeof deleteCartItemCreator>) {
  const url = getApiUrl(`${getCartApiPath()}/items/${itemId}`);
  try {
    const data = yield call(apiDelete, url);
    const deleteSuccess = data === true;
    if (!deleteSuccess) {
      throw new Error(`Couldn't delete item ${itemId}.`);
    }

    const cart = yield call(apiFetchCart);
    yield put(deleteCartItemSuccess(itemId));
    yield put(fetchCartSuccess(cart));
  } catch (err) {
    yield put(deleteCartItemFailure(err));
  }
}

function* applyCoupon({
  payload: couponCode,
}: ActionType<typeof applyCouponRequest>) {
  const url = getApiUrl(`${getCartApiPath()}/coupons/${couponCode}`);
  try {
    const success = yield call(apiPut, url);
    if (success !== true) {
      throw new Error(`Couldn't apply coupon "${couponCode}"`);
    }
    const cart = yield call(apiFetchCart);

    yield put(applyCouponSuccess(couponCode));
    yield put(fetchCartSuccess(cart));
  } catch (err) {
    yield put(applyCouponFailure(err));
  }
}

function* removeCoupon() {
  const url = getApiUrl(`${getCartApiPath()}/coupons`);
  try {
    const success = yield call(apiDelete, url);
    if (success !== true) {
      throw new Error(`Couldn't remove coupon.`);
    }
    yield put(removeCouponSuccess());
    yield put(fetchCartRequest());
  } catch (err) {
    yield put(removeCouponFailure(err));
  }
}

function* cartUpdated() {
  if (document.getElementById(AvardaCheckOut.DIV_ID)) {
    // TODO: Only here until quote update also updates Avarda
    yield call(apiGet, getApiUrl(`${getCartApiPath()}/avarda-payment`));
    yield call(AvardaCheckOutClient.updateItems);
  }
}

export default function* saga(): Generator<*, *, *> {
  yield all([
    yield fork(function* watchFetchCart() {
      yield takeLatest(Cart.FETCH_REQUEST, fetchCart);
    }),
    yield fork(function* watchFetchCartSuccess() {
      yield takeLatest(Cart.FETCH_SUCCESS, cartUpdated);
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
