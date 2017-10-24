// @flow
import {all} from 'redux-saga/effects';
import cartSaga from '$src/cart/sagas';

function* rootSaga(): Generator<*, *, *> {
  yield all([cartSaga()]);
}

export default rootSaga;
