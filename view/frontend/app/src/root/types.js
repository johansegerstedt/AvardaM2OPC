// @flow

type Cart = {
  id: string,
  items: string[], // CartITems ->
};

type Item = {
  id: string,
  sku: string,
  qty: string,
};

type Product = {
  id: string,
  sku: string,
};

export type AppState = {
  cart: Cart,
  cartItems: Item[],
  products: Product[],
};
