// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {ActionTypes} from './constants';
import type {Reducer} from '$src/root/types';

export const purchaseId: Reducer<null | string> = handleActions(
  {
    [ActionTypes.RECEIVE_PURCHASE_ID]: (state, {payload: purchaseId}) =>
      purchaseId,
  },
  null,
);

export default combineReducers({
  purchaseId,
});
