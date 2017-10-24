// @flow
import {all} from 'redux-saga/effects';
import cartSaga from '$src/cart/sagas';

function* fooSaga(): Generator<*, *, *> {
  console.log('Hello from Redux Saga!');
}

function* rootSaga(): Generator<*, *, *> {
  yield all([fooSaga(), cartSaga()]);
}

export default rootSaga;
