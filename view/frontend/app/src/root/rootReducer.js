// @flow
import {combineReducers} from 'redux';
import cart from '$src/cart/reducers';
import type {AppState} from './types';
import type {Action} from '../types';

const mainReducer: (AppState, Action<*, *>) => AppState = combineReducers({
  foo: () => true,
  cart,
});

export default mainReducer;
