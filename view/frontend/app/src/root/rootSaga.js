// @flow
import {all} from 'redux-saga/effects';

function* fooSaga(): Generator<*, *, *> {
  console.log('Hello from Redux Saga!');
}

function* rootSaga(): Generator<*, *, *> {
  yield all([fooSaga()]);
}

export default rootSaga;
