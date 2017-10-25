// @flow
import type {ById, EntitiesState, Normalized, Reference} from '$src/types';

/*
STATE
 */

export type Addresses = {
  id: number,
  customer_id: number,
  region: Region,
  region_id: number,
  country_id: string,
  street: string[],
  telephone: string,
  postcode: string,
  city: string,
  firstname: string,
  lastname: string,
  default_shipping: boolean,
};

export type BillingAddress = {
  id: number,
  region: string,
  region_id: string,
  region_code: string,
  country_id: string,
  street: string[],
  telephone: string,
  postcode: string,
  city: string,
  firstname: string,
  lastname: string,
  customer_id: number,
  email: string,
  same_as_billing: number,
  save_in_address_book: number,
};

export type Cart = {
  id: number,
  created_at: string,
  updated_at: string,
  is_active: boolean,
  is_virtual: boolean,
  items: Reference[],
  items_count: number,
  items_qty: number,
  customer: Customer,
  billing_address: BillingAddress,
  orig_order_id: number,
  currency: Currency,
  customer_is_guest: boolean,
  customer_note_notify: boolean,
  customer_tax_class_id: number,
  store_id: number,
  extension_attributes: ExtensionAttributes,
};

export type Currency = {
  global_currency_code: string,
  base_currency_code: string,
  store_currency_code: string,
  quote_currency_code: string,
  store_to_base_rate: number,
  store_to_quote_rate: number,
  base_to_global_rate: number,
  base_to_quote_rate: number,
};

export type Customer = {
  id: number,
  group_id: number,
  default_shipping: string,
  created_at: string,
  updated_at: string,
  created_in: string,
  email: string,
  firstname: string,
  lastname: string,
  store_id: number,
  website_id: number,
  addresses: Addresses[],
  disable_auto_group_change: number,
};

export type ExtensionAttributes = {
  shipping_assignments: ShippingAssignments[],
};

export type CartItem = {
  item_id: number,
  sku: string,
  qty: number,
  name: string,
  price: number,
  product_type: string,
  quote_id: string,
};

export type Region = {
  region_code: string,
  region: string,
  region_id: number,
};

export type Shipping = {
  address: BillingAddress,
  method: string,
};

export type ShippingAssignments = {
  shipping: Shipping,
  items: CartItem[],
};

export type CartState = {
  data: Cart | null,
  isFetching: boolean,
};

export type CartItemState = EntitiesState<CartItem>;

export type NormalizedCart = Normalized<{
  cart: ById<Cart>,
  cartItems: ById<CartItem>,
}>;
