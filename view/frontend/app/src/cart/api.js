// @flow
import {normalize, schema} from 'normalizr';
import merge from 'lodash/merge';
import {getApiUrl, apiGet} from '$src/m2api';
import {getCartApiPath} from './utils';
import type {NormalizedCart} from './types';

const cartItemSchema = new schema.Entity(
  'cartItems',
  {},
  {idAttribute: 'item_id'},
);

const cartSchema = new schema.Entity('cart', {
  items: [cartItemSchema],
});

export const fetchCart = async (): Promise<NormalizedCart> => {
  const url = getApiUrl(getCartApiPath());

  // To get all the necessary information about the quote and the items
  // we'll need to fetch the cart, the totals and product page urls etc.
  const [cart, totals, items] = await Promise.all([
    apiGet(url),
    apiGet(`${url}/totals`),
    apiGet(`${url}/avarda-items`),
  ]);
  const data = merge({}, cart, totals, items);
  return normalize(data, cartSchema);
};
