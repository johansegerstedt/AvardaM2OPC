// @flow
import {takeLatest} from 'redux-saga';
import {all, call, fork, put} from 'redux-saga/effects';
import {fetchCartSuccess} from './actions';
import {ActionTypes as Cart} from './constants';

function* fetchCart() {
  // eslint-disable-next-line no-console
  console.log('fetching the cart');
  yield put(fetchCartSuccess({id: 'todo'}));
}

export default function* saga(): Generator<*, *, *> {
  yield all([
    yield fork(function*() {
      yield takeLatest(Cart.FETCH_REQUEST, fetchCart);
    }),
  ]);
}
