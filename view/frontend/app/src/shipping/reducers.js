// @flow
import {combineReducers} from 'redux';
import {handleActions, type ActionType} from 'redux-actions';
import {ActionTypes} from './constants';
import {estimateShippingMethodsSuccess} from './actions';

const methods = handleActions(
  {
    [ActionTypes.ESTIMATE_SHIPPING_SUCCESS]: (
      state,
      {payload: methods}: ActionType<typeof estimateShippingMethodsSuccess>,
    ) => methods,
  },
  null,
);

export default combineReducers({
  methods,
  isFetching: false,
});
