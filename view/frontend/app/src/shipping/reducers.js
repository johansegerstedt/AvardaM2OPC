// @flow
import {combineReducers} from 'redux';
import {combineActions, handleActions, type ActionType} from 'redux-actions';
import {ActionTypes} from './constants';
import {receiveMethodsSuccess} from './actions';
import type {Reducer} from '$src/root/types';
import type {ShippingMethod, ShippingMethodState} from './types';

const methods: Reducer<null | ShippingMethod[]> = handleActions(
  {
    [ActionTypes.RECEIVE_METHODS_SUCCESS]: (
      state,
      {payload: methods}: ActionType<typeof receiveMethodsSuccess>,
    ) => methods,
  },
  null,
);

const isFetching: Reducer<boolean> = handleActions(
  {
    [ActionTypes.GET_METHODS_REQUEST]: () => true,
    [combineActions(
      ActionTypes.RECEIVE_METHODS_SUCCESS,
      ActionTypes.GET_METHODS_FAILURE,
    )]: () => false,
  },
  false,
);

const isSelecting: Reducer<boolean> = handleActions(
  {
    [combineActions(
      ActionTypes.SAVE_SHIPPING_INFORMATION,
      ActionTypes.SELECT_METHOD,
    )]: () => true,
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
  isFetching,
  isSelecting,
  messages,
});
