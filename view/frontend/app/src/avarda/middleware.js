// @flow
import {getSelectedShippingMethodValue as getSelectedMethod} from '$src/cart/selectors';
import {fetchPurchaseId} from './actions';
import type {Middleware} from 'redux';
import type {AppState, Actions} from '$src/root/types';

const middleware: Middleware<AppState, Actions> = ({
  getState,
  dispatch,
}) => next => action => {
  const shippingMethodSelected = !!getSelectedMethod(getState());
  let returnValue = next(action);

  if (!shippingMethodSelected) {
    const aWildSelectedShippingMethodAppeared = !!getSelectedMethod(getState());
    if (aWildSelectedShippingMethodAppeared) {
      dispatch(fetchPurchaseId());
    }
  }
  return returnValue;
};

export default middleware;
