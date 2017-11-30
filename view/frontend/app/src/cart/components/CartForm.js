// @flow
import React from 'react';
import {get} from 'lodash';
import $ from '$i18n';
import {formatCurrency} from '$src/utils/format';
import type {CartItem} from '../types';

type Props = {
  cartItems: CartItem[],
  currency: string,
  deleteCartItem(itemId: string): void,
  isUpdating: boolean,
  updateCartItems(CartItem[]): void,
};

const ItemRow = ({
  currency,
  deleteItem,
  item: {name, item_id, price_incl_tax, qty, isDeleting},
}: {
  currency: string,
  deleteItem: EventHandler,
  item: CartItem,
}) => (
  <tbody className="cart item">
    <tr key="0" className="item-info">
      <td data-th={$.mage.__('Item')} className="col item">
        <a
          href="http://avarda.box/fusion-backpack.html" // TODO
          title={name}
          tabIndex={-1}
          className="product-item-photo"
        >
          <span className="product-image-container" style={{width: 165}}>
            <span
              className="product-image-wrapper"
              style={{paddingBottom: '100%'}}
            >
              <img
                className="product-image-photo"
                // TODO
                src="http://avarda.box/static/version1510299755/frontend/Magento/luma/fi_FI/Magento_Catalog/images/product/placeholder/small_image.jpg"
                width={165}
                height={165}
                alt={name}
              />
            </span>
          </span>
        </a>
        <div className="product-item-details">
          <strong className="product-item-name">
            <a href="http://avarda.box/fusion-backpack.html">{name}</a>
          </strong>
        </div>
      </td>
      <td className="col price" data-th={$.mage.__('Price')}>
        <span className="price-excluding-tax" data-label="Excl. Tax">
          <span className="cart-price">
            <span className="price">
              {formatCurrency(price_incl_tax, currency)}
            </span>{' '}
          </span>
        </span>
      </td>
      <td className="col qty" data-th={$.mage.__('Qty')}>
        <div className="field qty">
          <label className="label" htmlFor="cart-98-qty">
            <span>{$.mage.__('Qty')}</span>
          </label>
          <div className="control qty">
            <input
              id="cart-98-qty"
              name={`cart[${item_id}][qty]`} // Used to get updated quantities!
              defaultValue={qty}
              type="number"
              size={4}
              title="Qty"
              min="0"
              className="input-text qty"
            />
          </div>
        </div>
      </td>
      <td className="col subtotal" data-th={$.mage.__('Subtotal')}>
        <span className="price-excluding-tax" data-label="Excl. Tax">
          <span className="cart-price">
            <span className="price">
              {formatCurrency(price_incl_tax * qty, currency)}
            </span>{' '}
          </span>
        </span>
      </td>
    </tr>
    <tr key="1" className="item-actions">
      <td colSpan={100}>
        <div className="actions-toolbar">
          <div
            id="gift-options-cart-item-98"
            className="gift-options-cart-item"
          />
          {/*<a
          className="action action-edit"
          href="http://avarda.box/checkout/cart/configure/id/98/product_id/6/"
          title="Edit item parameters">
          <span>Edit </span>
        </a>*/}
          <button
            title={$.mage.__('Remove item')}
            className="action action-delete"
            onClick={deleteItem}
            data-itemid={item_id}
            disabled={isDeleting}
            type="button"
          >
            <span>{$.mage.__('Remove item')}</span>
          </button>
        </div>
      </td>
    </tr>
  </tbody>
);

class CartForm extends React.Component<Props> {
  updateCartItems: EventHandler = event => {
    event.preventDefault();
    const {cartItems, updateCartItems} = this.props;
    const quantities = cartItems.reduce(
      (qtyById, {item_id, qty}) => ({
        ...qtyById,
        [item_id]: parseInt(
          get(event.target, `cart[${item_id}][qty]`, {value: qty}).value,
        ),
      }),
      {},
    );

    const updates = cartItems
      .filter(({item_id, qty}) => qty !== quantities[item_id])
      .map(item => ({...item, qty: quantities[item.item_id]}));

    updateCartItems(updates);
  };

  deleteCartItem: EventHandler = event => {
    const {deleteCartItem} = this.props;
    event.preventDefault();
    const itemId: ?string = get(event.target, 'dataset.itemid');
    if (typeof itemId === 'string') {
      deleteCartItem(itemId);
    }
  };

  render() {
    const {cartItems, currency, isUpdating} = this.props;
    return (
      <form
        id="form-validate"
        name="cartForm"
        className="form form-cart"
        noValidate="novalidate"
        onSubmit={this.updateCartItems}
      >
        <div className="cart table-wrapper">
          <table id="shopping-cart-table" className="cart items data table">
            <caption role="heading" aria-level={2} className="table-caption">
              {$.mage.__('Shopping Cart Items')}
            </caption>
            <thead>
              <tr>
                <th className="col item" scope="col">
                  <span>{$.mage.__('Item')}</span>
                </th>
                <th className="col price" scope="col">
                  <span>{$.mage.__('Price')}</span>
                </th>
                <th className="col qty" scope="col">
                  <span>{$.mage.__('Qty')}</span>
                </th>
                <th className="col subtotal" scope="col">
                  <span>{$.mage.__('Subtotal')}</span>
                </th>
              </tr>
            </thead>

            {cartItems.map(item => (
              <ItemRow
                key={item.item_id}
                item={item}
                deleteItem={this.deleteCartItem}
                currency={currency}
              />
            ))}
          </table>
        </div>
        <div className="cart main actions">
          <a
            className="action continue"
            href="/"
            title={$.mage.__('Continue Shopping')}
          >
            <span>{$.mage.__('Continue Shopping')}</span>
          </a>
          <button
            name="update_cart_action"
            data-cart-empty
            value="empty_cart"
            title={$.mage.__('Clear Shopping Cart')}
            className="action clear"
            id="empty_cart_button"
          >
            <span>{$.mage.__('Clear Shopping Cart')}</span>
          </button>
          <button
            type="submit"
            name="update_cart_action"
            value="update_qty"
            disabled={!!isUpdating}
            title={$.mage.__('Update Shopping Cart')}
            className="action update"
          >
            <span>{$.mage.__('Update Shopping Cart')}</span>
          </button>
          <input
            type="hidden"
            defaultValue
            id="update_cart_action_container"
            data-cart-item-update
          />
        </div>
      </form>
    );
  }
}

export default CartForm;
