// @flow
import {all} from 'redux-saga/effects';
import cartSaga from '$src/cart/sagas';
import shippingSaga from '$src/shipping/sagas';

function* rootSaga(): Generator<*, *, *> {
  yield all([cartSaga(), shippingSaga()]);
}

export default rootSaga;
