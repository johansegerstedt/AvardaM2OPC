// @flow
import {combineReducers} from 'redux';
import {combineActions, handleActions, type ActionType} from 'redux-actions';
import {ActionTypes} from './constants';
import {estimateShippingMethodsSuccess} from './actions';
import type {Reducer} from '$src/root/types';
import type {ShippingMethod} from './types';

const methods: Reducer<null | ShippingMethod[]> = handleActions(
  {
    [ActionTypes.ESTIMATE_SHIPPING_SUCCESS]: (
      state,
      {payload: methods}: ActionType<typeof estimateShippingMethodsSuccess>,
    ) => methods,
  },
  null,
);

const selectedMethod: Reducer<null | ShippingMethod> = handleActions(
  {
    [ActionTypes.SET_SHIPPING_INFORMATION_SUCCESS]: (
      state,
      {payload: method},
    ) => method,
  },
  null,
);

const isFetching: Reducer<boolean> = handleActions(
  {
    [ActionTypes.ESTIMATE_SHIPPING]: () => true,
    [combineActions(
      ActionTypes.ESTIMATE_SHIPPING_SUCCESS,
      ActionTypes.ESTIMATE_SHIPPING_FAILURE,
    )]: () => false,
  },
  false,
);

const isSelecting: Reducer<boolean> = handleActions({}, false);

export default combineReducers({
  methods,
  selectedMethod,
  isFetching,
  isSelecting,
});
