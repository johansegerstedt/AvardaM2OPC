// @flow
import type {ById, EntitiesState, Normalized, Reference} from '$src/types';

/*
STATE
 */

export type Address = {
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
  region: null | string,
  region_id: null | number,
  region_code: null | string,
  country_id: null | string,
  street: string[],
  telephone: null | string,
  postcode: null | string,
  city: null | string,
  firstname: null | string,
  lastname: null | string,
  customer_id: null | number,
  email: null | string,
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
  grand_total: number,
  base_grand_total: number,
  subtotal: number,
  base_subtotal: number,
  discount_amount: number,
  base_discount_amount: number,
  subtotal_with_discount: number,
  base_subtotal_with_discount: number,
  shipping_amount: number,
  base_shipping_amount: number,
  shipping_discount_amount: number,
  base_shipping_discount_amount: number,
  tax_amount: number,
  base_tax_amount: number,
  weee_tax_applied_amount: null | number,
  shipping_tax_amount: number,
  base_shipping_tax_amount: number,
  subtotal_incl_tax: number,
  shipping_incl_tax: number,
  base_shipping_incl_tax: number,
  base_currency_code: string,
  quote_currency_code: string,
  total_segments: TotalSegment[],
  coupon_code?: string,
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
  addresses: Address[],
  disable_auto_group_change: number,
};

export type ExtensionAttributes = {
  shipping_assignments: ShippingAssignments[],
};

export type ExtensionAttributes1 = {
  tax_grandtotal_details: TaxGrandtotalDetails[],
};

export type CartItem = {
  isDeleting?: boolean,
  item_id: number,
  sku: string,
  qty: number,
  name: string,
  price: number,
  product_type: string,
  quote_id: string,
  base_price: number,
  row_total: number,
  base_row_total: number,
  row_total_with_discount: number,
  tax_amount: number,
  base_tax_amount: number,
  tax_percent: number,
  discount_amount: number,
  base_discount_amount: number,
  discount_percent: number,
  price_incl_tax: number,
  base_price_incl_tax: number,
  row_total_incl_tax: number,
  base_row_total_incl_tax: number,
  options: string,
  weee_tax_applied_amount: null | number,
  weee_tax_applied: null | number,
  product_url: string,
  image_url: string,
};

export type Items1 = {
  item_id: number,
  sku: string,
  qty: number,
  name: string,
  price: number,
  product_type: string,
  quote_id: string,
};

export type Rates = {
  percent: string,
  title: string,
};

export type Region = {
  region_code: string,
  region: string,
  region_id: number,
};

export type Shipping = {
  address: BillingAddress,
  method: null | string,
};

export type ShippingAssignments = {
  shipping: Shipping,
  items: CartItem[],
};

export type TaxGrandtotalDetails = {
  amount: number,
  rates: Rates[],
  group_id: number,
};

export type TotalSegment = {
  code: string,
  title: string,
  value: number,
  extension_attributes?: ExtensionAttributes1,
  area?: string,
};

export type CartState = {
  data: Cart | null,
  isFetching: boolean,
  pendingUpdates: number,
};

export type CartItemState = EntitiesState<CartItem>;

export type NormalizedCart = Normalized<{
  cart: ById<Cart>,
  cartItems: ById<CartItem>,
}>;
