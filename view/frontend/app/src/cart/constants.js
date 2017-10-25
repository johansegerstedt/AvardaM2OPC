// @flow
import {schema} from 'normalizr';

/*
API
 */
export const cartItemSchema = new schema.Entity(
  'cartItems',
  {},
  {idAttribute: 'item_id'},
);

export const cartSchema = new schema.Entity('cart', {
  items: [cartItemSchema],
});

/*
ACTIONS
 */

const FETCH_REQUEST: 'fetchCartRequest' = 'fetchCartRequest';
const FETCH_SUCCESS: 'fetchCartSuccess' = 'fetchCartSuccess';
const FETCH_FAILURE: 'fetchCartFailure' = 'fetchCartFailure';

export const ActionTypes = {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
};
