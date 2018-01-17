// @flow
import AvardaCheckOutClient from 'AvardaCheckOutClient';
import {isEqual} from 'lodash';
import {takeLatest} from 'redux-saga';
import {all, call, fork, put, select, take} from 'redux-saga/effects';
import quote from 'Magento_Checkout/js/model/quote';
import {getConfig} from '$src/config';
import {apiGet, apiPost, getApiUrl} from '$src/m2api';
import {ActionTypes as Cart} from '$src/cart/constants';
import {getCartApiPath} from '$src/cart/utils';
import {getIsVirtual} from '$src/cart/selectors';
import {ActionTypes as ShippingActions} from '$src/shipping/constants';
import {getSelectedMethod} from '$src/shipping/selectors';
import {fetchShippingMethods} from '$src/shipping/api';
import {addMessage, updateAddress, scrollToForm} from '$src/shipping/actions';
import {
  fetchPurchaseId as fetchPurchaseIdAction,
  receivePurchaseId,
  addressChanged as addressChangedAction,
  updatedItems,
  completePaymentPressed as completePaymentPressedAction,
} from './actions';
import * as ShippingMessages from './messages';
import {ActionTypes} from './constants';
import {getPurchaseId, getIsFetching} from './selectors';
import {DIV_ID} from './components/AvardaCheckOut';
import type {ActionType} from 'redux-actions';
import type {CustomerInfo} from 'AvardaCheckOutClient';
import type {BillingAddress} from '$src/cart/types';

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

const infoToAddress = (info: CustomerInfo): * => ({
  firstname: info.FirstName,
  lastname: info.LastName,
  street: [info.Address],
  postcode: info.ZipCode,
  city: info.City,
  country_id: getConfig().countryId, // TODO
});

const mergeAddress = (address: BillingAddress, info: CustomerInfo) => ({
  ...address,
  ...infoToAddress(info),
});

function* addressChanged({
  payload: {result, info},
}: ActionType<typeof addressChangedAction>) {
  if (yield select(getIsVirtual)) {
    return result.continue();
  }
  const shippingAddress = yield call([quote, quote.shippingAddress]);
  const selectedMethod = yield select(getSelectedMethod);
  const newAddress = mergeAddress(shippingAddress, info);
  const methods = yield call(fetchShippingMethods, newAddress);

  // Continue if no need to select new shipping method
  yield put(updateAddress(newAddress));
  if (methods.some(method => isEqual(method, selectedMethod))) {
    return yield call([result, result.continue]);
  }
  yield put(scrollToForm());
  yield put(addMessage(ShippingMessages.SelectShippingMethod));
  yield take(ShippingActions.SAVE_SHIPPING_INFORMATION_SUCCESS);
  yield take(ActionTypes.UPDATED_ITEMS);
  yield call([result, result.continue]);
}

function* cartUpdated() {
  if (yield select(getPurchaseId)) {
    yield put({type: 'avarda/updateItems'});
    yield call(apiGet, getApiUrl(`${getCartApiPath()}/avarda-payment`));

    if (document.getElementById(DIV_ID)) {
      // TODO: Only here until quote update also updates Avarda
      yield call(AvardaCheckOutClient.updateItems);
    }

    yield put(updatedItems());
  } else if (!(yield select(getIsFetching)) && (yield select(getIsVirtual))) {
    yield put(fetchPurchaseIdAction());
  }
}

function* completePayment({
  payload: {result},
}: ActionType<typeof completePaymentPressedAction>) {
  yield call(apiPost, getApiUrl(`${getCartApiPath()}/avarda-payment`));
  yield call([result, result.continue]);
}

export default function*(): Generator<*, *, *> {
  yield all([
    yield fork(function* watchFetchPurchaseId() {
      yield takeLatest(ActionTypes.GET_PURCHASE_ID, fetchPurchaseId);
    }),
    yield fork(function* watchCartUpdated() {
      yield takeLatest([Cart.FETCH_SUCCESS, Cart.REFRESH_CART], cartUpdated);
    }),
    yield fork(function* watchAddressChanged() {
      yield takeLatest(ActionTypes.ADDRESS_CHANGED, addressChanged);
    }),
  ]);
  yield takeLatest(ActionTypes.COMPLETE_PAYMENT_PRESSED, completePayment);
}
