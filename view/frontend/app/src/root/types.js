// @flow
import type {Selector as _Selector} from 'reselect';
import type {CartState, CartItemState} from '$src/cart/types';
import type {CartActions} from '$src/cart/actions';
import type {ShippingMethodState} from '$src/shipping/types';
import type {ShippingActions} from '$src/shipping/actions';
import type {AvardaState} from '$src/avarda/types';
import type {AvardaActions} from '$src/avarda/actions';

export type AppState = {
  cart: CartState,
  cartItems: CartItemState,
  shippingMethods: ShippingMethodState,
  avarda: AvardaState,
};

export type Selector<Props, Result> = _Selector<AppState, Props, Result>;

export type Actions = CartActions | ShippingActions | AvardaActions;

export type Reducer<Value> = (Value, Actions) => Value;
