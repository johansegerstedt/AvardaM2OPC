// @flow
import {getApiUrl, apiPost} from '$src/m2api';
import {getCartApiPath} from '$src/cart/utils';
import type {BillingAddress} from '$src/cart/types';

export const fetchShippingMethods = async (address: BillingAddress) =>
  apiPost(getApiUrl(`${getCartApiPath()}/estimate-shipping-methods`), {
    address,
  });
