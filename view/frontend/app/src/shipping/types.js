// @flow

export type ShippingMethod = {
  carrier_code: string,
  method_code: string,
  carrier_title: string,
  method_title: string,
  amount: number,
  base_amount: string,
  available: boolean,
  error_message: string,
  price_excl_tax: number,
  price_incl_tax: number,
};

export type ShippingMethodState = {
  methods: ShippingMethod[],
  isFetching: boolean,
};
