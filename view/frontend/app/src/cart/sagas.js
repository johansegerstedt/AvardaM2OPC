// @flow
import {takeEvery, takeLatest, all, call, fork, put} from 'redux-saga/effects';
import {$, interpolate} from '$i18n';
import toast, {TYPES} from '$src/utils/toast';
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
  refreshCart as refreshCartAction,
  removeCouponSuccess,
  removeCouponFailure,
  FETCH_REQUEST,
  UPDATE_ITEMS_REQUEST,
  DELETE_ITEM_REQUEST,
  APPLY_COUPON_REQUEST,
  REMOVE_COUPON_REQUEST,
} from './actions';
import {fetchCart as apiFetchCart} from './api';
import {getApiUrl, apiDelete, apiPut} from '$src/m2api';
import {getConfig} from '$src/config';
import type {ActionType} from 'redux-actions';

function* fetchCart(): Saga {
  try {
    const cart = yield call(apiFetchCart);
    yield put(fetchCartSuccess(cart));
  } catch (err) {
    yield put(fetchCartFailure(err));
    toast(
      $.mage.__(
        'There was a problem loading the cart. Please reload the page.',
      ),
      TYPES.ERROR,
    );
  }
}

export function* refreshCart(): Saga {
  try {
    const cart = yield call(apiFetchCart);
    yield put(refreshCartAction(cart));
  } catch (err) {
    yield put(fetchCartFailure(err));
    toast(
      $.mage.__(
        'There was a problem loading the cart. Please reload the page.',
      ),
      TYPES.ERROR,
    );
  }
}

function* updateCartItems({payload = []}: {payload: any[]} = {}): Saga {
  const baseUrl = `${getCartApiPath()}/items`;
  try {
    // Each cart item must be updated separately
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
    toast($.mage.__("Couldn't update the cart."), TYPES.ERROR);
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
    toast(
      $.mage.__('There was a problem removing an item from the cart.'),
      TYPES.ERROR,
    );
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
    toast(
      interpolate($.mage.__('The coupon code "%1" is not valid.'), couponCode),
      TYPES.ERROR,
    );
  }
}

function* removeCoupon(): Saga {
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
    toast($.mage.__('There was a problem with the coupon code.'), TYPES.ERROR);
  }
}

export default function* saga(): Saga {
  yield all([
    yield fork(function* watchFetchCart() {
      yield takeLatest(FETCH_REQUEST, fetchCart);
    }),
    yield fork(function* watchUpdateItems() {
      yield takeLatest(UPDATE_ITEMS_REQUEST, updateCartItems);
    }),
    yield fork(function* watchDeleteItem() {
      yield takeEvery(DELETE_ITEM_REQUEST, deleteCartItem);
    }),
    yield fork(function* watchApplyCoupon() {
      yield takeEvery(APPLY_COUPON_REQUEST, applyCoupon);
    }),
    yield fork(function* watchRemoveCoupon() {
      yield takeLatest(REMOVE_COUPON_REQUEST, removeCoupon);
    }),
  ]);
}
