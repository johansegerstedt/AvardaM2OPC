// @flow
import AvardaCheckOutClient from 'AvardaCheckOutClient';
import {isEqual} from 'lodash';
import {
  takeLatest,
  all,
  call,
  fork,
  put,
  select,
  take,
} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import quote from 'Magento_Checkout/js/model/quote';
import {$} from '$i18n';
import {getConfig} from '$src/config';
import {apiGet, apiPost, getApiUrl} from '$src/m2api';
import {ActionTypes as Cart} from '$src/cart/constants';
import {getCartApiPath} from '$src/cart/utils';
import {getIsVirtual} from '$src/cart/selectors';
import {ActionTypes as ShippingActions} from '$src/shipping/constants';
import {fetchShippingMethods} from '$src/shipping/api';
import {addMessage, updateAddress, scrollToForm} from '$src/shipping/actions';
import toast, {TYPES} from '$src/utils/toast';
import {
  receivePurchaseId,
  getPurchaseIdFailure,
  addressChanged as addressChangedAction,
  updatedItems,
  completePaymentPressed as completePaymentPressedAction,
} from './actions';
import * as ShippingMessages from './messages';
import {ActionTypes} from './constants';
import {getPurchaseId} from './selectors';
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
    toast(
      $.mage.__(
        `Failed to initialize payment with Avarda. Try reloading the page.`,
      ),
      TYPES.ERROR,
    );
    yield put(getPurchaseIdFailure(err));
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
  try {
    if (yield select(getIsVirtual)) {
      return result.continue();
    }
    // Get shipping address and the selected method from ko.observables
    const shippingAddress = yield call([quote, quote.shippingAddress]);
    const selectedMethod = yield call([quote, quote.shippingMethod]);
    const newAddress = mergeAddress(shippingAddress, info);
    const methods = yield call(fetchShippingMethods, newAddress);

    // Continue if no need to select new shipping method
    yield put(updateAddress(newAddress));
    if (methods.some(method => isEqual(method, selectedMethod))) {
      // result.continue let's iframe continue
      return yield call([result, result.continue]);
    }
    // Scroll the page to the shipping method selection
    // and instruct the customer to select new shipping method
    yield put(scrollToForm());
    yield put(addMessage(ShippingMessages.SelectShippingMethod));
    yield take(ShippingActions.SAVE_SHIPPING_INFORMATION_SUCCESS);
    yield take(ActionTypes.UPDATED_ITEMS);
    yield call([result, result.continue]);
  } catch (err) {
    toast(
      $.mage.__('Failed to sync address information. Try reloading the page.'),
      TYPES.ERROR,
    );
    // Tell the iframe there was an error and the action must be cancelled
    result.cancel();
  }
}

function* cartUpdated() {
  try {
    if (yield select(getPurchaseId)) {
      yield put({type: 'avarda/updateItems'});

      if (document.getElementById(DIV_ID)) {
        // Make the iframe get updates from Avarda API
        yield call(AvardaCheckOutClient.updateItems);
      }

      yield put(updatedItems());
    }
  } catch (err) {
    toast(
      $.mage.__('Failed to sync updates to Avarda. Try reloading the page.'),
      TYPES.ERROR,
    );
  }
}

function* completePayment({
  payload: {result},
}: ActionType<typeof completePaymentPressedAction>) {
  try {
    yield call(apiPost, getApiUrl(`${getCartApiPath()}/avarda-payment`));
    yield call([result, result.continue]);
  } catch (err) {
    toast($.mage.__('Failed to create an order.'), TYPES.ERROR);
    result.cancel();
  }
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
