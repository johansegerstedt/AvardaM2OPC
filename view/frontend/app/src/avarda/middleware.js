// @flow
import {
  getSelectedShippingMethodValue as getSelectedMethod,
  getIsVirtual,
} from '$src/cart/selectors';
import {getPurchaseId, getIsFetching} from './selectors';
import {fetchPurchaseId} from './actions';
import type {Middleware} from 'redux';
import type {AppState, Actions} from '$src/root/types';

/**
 * Redux middleware that decides when to fetch Avarda purchase ID
 * and therefore show the iframe
 */
const middleware: Middleware<AppState, Actions> = ({
  getState,
  dispatch,
}) => next => action => {
  const shippingMethodSelected = !!getSelectedMethod(getState());
  let returnValue = next(action);
  const isVirtual = getIsVirtual(getState());
  const purchaseId = getPurchaseId(getState());
  const isFetchingPurchaseId = getIsFetching(getState());

  if (isVirtual && !purchaseId && !isFetchingPurchaseId) {
    // Cart is virtual and there's no purchase id yet
    dispatch(fetchPurchaseId());
  } else if (!shippingMethodSelected) {
    // Shipping method appears for the first time
    const aWildSelectedShippingMethodAppeared = !!getSelectedMethod(getState());
    if (aWildSelectedShippingMethodAppeared) {
      dispatch(fetchPurchaseId());
    }
  }
  return returnValue;
};

export default middleware;
