// @flow
import type {InputSelector} from 'reselect';
import type {CartState} from '$src/cart/types';
import type {CartActions} from '$src/cart/actions';
import type {ShippingActions} from '$src/shipping/actions';
import type {AvardaActions} from '$src/avarda/actions';
import type {Config} from '$src/types';

export type AppState = {
  cart: CartState,
  config: Config,
};

export type Selector<Props, Result> = InputSelector<AppState, Props, Result>;

export type Actions = CartActions | ShippingActions | AvardaActions;

export type Reducer<Value> = (Value, Actions) => Value;
