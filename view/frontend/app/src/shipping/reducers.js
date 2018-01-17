// @flow
import {combineReducers} from 'redux';
import {combineActions, handleActions, type ActionType} from 'redux-actions';
import {ActionTypes} from './constants';
import {receiveMethods, receiveSelectedMethod, selectMethod} from './actions';
import type {Reducer} from '$src/root/types';
import type {ShippingMethod, ShippingMethodState} from './types';

const methods: Reducer<null | ShippingMethod[]> = handleActions(
  {
    [ActionTypes.RECEIVE_METHODS]: (
      state,
      {payload: methods}: ActionType<typeof receiveMethods>,
    ) => methods,
  },
  null,
);

const selectedMethod: Reducer<null | ShippingMethod> = handleActions(
  {
    [combineActions(
      ActionTypes.SELECT_METHOD,
      ActionTypes.RECEIVE_SELECTED_METHOD,
    )]: (
      state,
      {
        payload: method,
      }:
        | ActionType<typeof selectMethod>
        | ActionType<typeof receiveSelectedMethod>,
    ) => method,
  },
  null,
);

const isFetching: Reducer<boolean> = handleActions(
  {
    [ActionTypes.GET_METHODS]: () => true,
    [combineActions(
      ActionTypes.RECEIVE_METHODS,
      ActionTypes.GET_METHODS_FAILURE,
    )]: () => false,
  },
  false,
);

const isSelecting: Reducer<boolean> = handleActions(
  {
    [ActionTypes.SAVE_SHIPPING_INFORMATION]: () => true,
    [combineActions(
      ActionTypes.SAVE_SHIPPING_INFORMATION_SUCCESS,
      ActionTypes.SAVE_SHIPPING_INFORMATION_FAILURE,
    )]: () => false,
  },
  false,
);

const messages: Reducer<
  $PropertyType<ShippingMethodState, 'messages'>,
> = handleActions(
  {
    [ActionTypes.ADD_MESSAGE]: (state, {payload: message}) =>
      state ? [...state, message] : [message],
    [ActionTypes.SAVE_SHIPPING_INFORMATION_SUCCESS]: () => null,
  },
  null,
);

export default combineReducers({
  methods,
  selectedMethod,
  isFetching,
  isSelecting,
  messages,
});
