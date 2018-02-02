// @flow
import {combineReducers} from 'redux';
import {handleActions, combineActions} from 'redux-actions';
import {ActionTypes} from './constants';
import type {Reducer} from '$src/root/types';

export const purchaseId: Reducer<null | string> = handleActions(
  {
    [ActionTypes.RECEIVE_PURCHASE_ID]: (state, {payload: purchaseId}) =>
      purchaseId,
  },
  null,
);

const isFetching: Reducer<boolean> = handleActions(
  {
    [ActionTypes.GET_PURCHASE_ID]: () => true,
    [combineActions(
      ActionTypes.RECEIVE_PURCHASE_ID,
      ActionTypes.GET_PURCHASE_ID_FAILURE,
    )]: () => false,
  },
  false,
);

export default combineReducers({
  purchaseId,
  isFetching,
});
