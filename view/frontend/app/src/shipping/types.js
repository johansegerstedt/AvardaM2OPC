// @flow
import type {MessageState} from '$src/utils/types';

export type ShippingMethodAvailable = {
  carrier_code: string,
  method_code: string,
  carrier_title: string,
  method_title: string,
  amount: number,
  base_amount: number,
  available: true,
  error_message: string,
  price_excl_tax: number,
  price_incl_tax: number,
};

export type ShippingMethodUnavailable = {
  carrier_code: string,
  method_code: null,
  carrier_title: string,
  amount: number,
  base_amount: null,
  available: false,
  error_message: string,
  price_excl_tax: number,
  price_incl_tax: number,
};

export type ShippingMethod =
  | ShippingMethodAvailable
  | ShippingMethodUnavailable;

export type ShippingMethodState = {
  methods: ShippingMethod[] | null,
  isFetching: boolean,
  isSelecting: boolean,
  messages: null | MessageState[],
};
