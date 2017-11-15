// @flow
import {all} from 'redux-saga/effects';
import cartSaga from '$src/cart/sagas';
import shippingSaga from '$src/shipping/sagas';
import avardaSaga from '$src/avarda/sagas';

function* rootSaga(): Generator<*, *, *> {
  yield all([cartSaga(), shippingSaga(), avardaSaga()]);
}

export default rootSaga;
