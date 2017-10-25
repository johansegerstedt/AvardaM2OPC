// @flow
import React from 'react';
import {formatCurrency} from '$src/utils/format';
import type {CartItem} from '../types';

type Props = {
  cartItems: CartItem[],
};

const ItemRow = ({
  item: {name, price_incl_tax, row_total_incl_tax, qty},
}: {
  item: CartItem,
}) => [
  <tr key="0" className="item-info">
    <td data-th="Item" className="col item">
      <a
        href="http://avarda.box/fusion-backpack.html" // TODO
        title={name}
        tabIndex={-1}
        className="product-item-photo">
        <span className="product-image-container" style={{width: 165}}>
          <span
            className="product-image-wrapper"
            style={{paddingBottom: '100%'}}>
            <img
              className="product-image-photo"
              src="http://avarda.box/media/catalog/product/cache/small_image/165x165/beff4985b56e3afdbeabfc89641a4582/m/b/mb02-gray-0.jpg"
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
    <td className="col price" data-th="Price">
      <span className="price-excluding-tax" data-label="Excl. Tax">
        <span className="cart-price">
          <span className="price">{formatCurrency(price_incl_tax)}</span>{' '}
        </span>
      </span>
    </td>
    <td className="col qty" data-th="Qty">
      <div className="field qty">
        <label className="label" htmlFor="cart-98-qty">
          <span>Qty</span>
        </label>
        <div className="control qty">
          <input
            id="cart-98-qty"
            name="cart[98][qty]"
            data-cart-item-id="24-MB02"
            defaultValue={qty}
            type="number"
            size={4}
            title="Qty"
            className="input-text qty"
            maxLength={12}
            data-validate="{required:true,'validate-greater-than-zero':true}"
            data-role="cart-item-qty"
          />
        </div>
      </div>
    </td>
    <td className="col subtotal" data-th="Subtotal">
      <span className="price-excluding-tax" data-label="Excl. Tax">
        <span className="cart-price">
          <span className="price">
            {formatCurrency(row_total_incl_tax)}
          </span>{' '}
        </span>
      </span>
    </td>
  </tr>,
  <tr key="1" className="item-actions">
    <td colSpan={100}>
      <div className="actions-toolbar">
        <div
          id="gift-options-cart-item-98"
          data-bind="scope:'giftOptionsCartItem-98'"
          className="gift-options-cart-item"
        />
        {/*<a
          className="action action-edit"
          href="http://avarda.box/checkout/cart/configure/id/98/product_id/6/"
          title="Edit item parameters">
          <span>Edit </span>
        </a>*/}
        <a
          href="#"
          title="Remove item"
          className="action action-delete"
          data-post="{&quot;action&quot;:&quot;http:\/\/avarda.box\/checkout\/cart\/delete\/&quot;,&quot;data&quot;:{&quot;id&quot;:&quot;98&quot;,&quot;uenc&quot;:&quot;aHR0cDovL2F2YXJkYS5ib3gvY2hlY2tvdXQvY2FydC8,&quot;}}">
          <span>Remove item </span>
        </a>
      </div>
    </td>
  </tr>,
];

class CartForm extends React.Component<Props> {
  render() {
    const {cartItems} = this.props;
    return (
      <form
        id="form-validate"
        className="form form-cart"
        noValidate="novalidate">
        <div className="cart table-wrapper">
          <table id="shopping-cart-table" className="cart items data table">
            <caption role="heading" aria-level={2} className="table-caption">
              Shopping Cart Items
            </caption>
            <thead>
              <tr>
                <th className="col item" scope="col">
                  <span>Item</span>
                </th>
                <th className="col price" scope="col">
                  <span>Price</span>
                </th>
                <th className="col qty" scope="col">
                  <span>Qty</span>
                </th>
                <th className="col subtotal" scope="col">
                  <span>Subtotal</span>
                </th>
              </tr>
            </thead>
            <tbody className="cart item">
              {cartItems.map(item => (
                <ItemRow key={item.item_id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="cart main actions">
          <a
            className="action continue"
            href="http://avarda.box/"
            title="Continue Shopping">
            <span>Continue Shopping</span>
          </a>
          <button
            type="submit"
            name="update_cart_action"
            data-cart-empty
            value="empty_cart"
            title="Clear Shopping Cart"
            className="action clear"
            id="empty_cart_button">
            <span>Clear Shopping Cart</span>
          </button>
          <button
            type="submit"
            name="update_cart_action"
            data-cart-item-update
            value="update_qty"
            title="Update Shopping Cart"
            className="action update">
            <span>Update Shopping Cart</span>
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
