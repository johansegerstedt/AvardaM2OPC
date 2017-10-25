// @flow
import type {Selector as _Selector} from 'reselect';
import type {CartState, CartItemState} from '$src/cart/types';
import type {CartActions} from '$src/cart/actions';

export type AppState = {
  cart: CartState,
  cartItems: CartItemState,
};

export type Selector<Props, Result> = _Selector<AppState, Props, Result>;

export type Actions = CartActions;

export type Reducer<Value> = (Value, Actions) => Value;
