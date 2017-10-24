// @flow
import {combineReducers} from 'redux';
import type {AppState} from './types';
import type {Action} from '../types';

const mainReducer: (AppState, Action<*, *>) => AppState = combineReducers({
  foo: () => true,
});

export default mainReducer;
