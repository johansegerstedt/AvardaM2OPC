// @flow
import {fork} from 'redux-saga/effects';
import cartSaga from '$src/cart/sagas';
import shippingSaga from '$src/shipping/sagas';
import avardaSaga from '$src/avarda/sagas';

function* rootSaga(): Generator<*, *, *> {
  yield [fork(cartSaga), fork(shippingSaga), fork(avardaSaga)];
}

export default rootSaga;
