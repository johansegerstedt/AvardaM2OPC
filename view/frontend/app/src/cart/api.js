// @flow
import {normalize} from 'normalizr';
import {merge} from 'lodash';
import {getApiUrl, apiGet} from '$src/m2api';
import {getCartApiPath} from './utils';
import {cartSchema} from './constants';
import type {NormalizedCart} from './types';

export const fetchCart = async (): Promise<NormalizedCart> => {
  const url = getApiUrl(getCartApiPath());

  const [cart, totals] = await Promise.all([
    apiGet(url),
    apiGet(`${url}/totals`),
  ]);
  const data = merge({}, cart, totals);
  return normalize(data, cartSchema);
};
