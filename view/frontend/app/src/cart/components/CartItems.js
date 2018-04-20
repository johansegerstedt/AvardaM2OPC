// @flow
import React, {Fragment} from 'react';
import {get} from 'lodash';
import {$} from '$i18n';
import {formatCurrency} from '$src/utils/format';
import {getConfig} from '$src/config';
import type {CartItem} from '../types';

type Props = {
  cartItems: CartItem[],
  currency: string,
  deleteCartItem(itemId: string): void,
  isUpdating: boolean,
  updateCartItems(CartItem[]): void,
};

const getSrcFallbackHandler = (uri: string) => (ev: SyntheticEvent<>): void => {
  if (ev.target instanceof HTMLImageElement) {
    ev.target.src = uri;
  }
};

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
      <Fragment>
        <div className="avarda-mobile-hide">
          <i className="material-icons md-orange md-48">check_circle</i>
          <div className="avarda-sidebar-header">
            <span className="avarda-title">{$.mage.__('Order Review')}</span>
            <div className="collapsable-info">
              <span>
                {$.mage
                  .__('%1 Item(s) in cart')
                  .replace('%1', cartItems.length.toString())}
              </span>
            </div>
          </div>
        </div>
        <div className="avarda-cart-items-container">
          <div className="avarda-cart-items">
            <form
              id="form-validate"
              name="cartForm"
              className="form form-cart"
              noValidate="novalidate"
              onSubmit={this.updateCartItems}
            >
              {cartItems.map(item => (
                <ProductItem
                  key={item.item_id}
                  item={item}
                  deleteItem={this.deleteCartItem}
                  currency={currency}
                />
              ))}
              <Actions isUpdating={isUpdating} />
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

const Actions = ({isUpdating}: {isUpdating: boolean}) => {
  const {continueShoppingUrl} = getConfig();

  const goToHome: EventHandler = event => {
    event.preventDefault();
    window.location = continueShoppingUrl;
  };
  return (
    <div className="cart main actions cart-actions">
      <button
        name="continue_shopping"
        onClick={goToHome}
        data-cart-empty
        value="continue_shopping"
        title={$.mage.__('Continue shopping')}
        className="action"
        id="continue_shopping"
      >
        <i className="material-icons md-18">shop</i>
      </button>
      <button
        name="update_cart_action"
        data-cart-empty
        value="empty_cart"
        title={$.mage.__('Clear')}
        className="action clear"
        id="empty_cart_button"
      >
        <i className="material-icons md-18">clear</i>
      </button>
      <button
        type="submit"
        name="update_cart_action"
        value="update_qty"
        disabled={!!isUpdating}
        title={$.mage.__('Update')}
        className="action update primary"
      >
        <i className="material-icons md-18">done</i>
      </button>
      <input
        type="hidden"
        defaultValue
        id="update_cart_action_container"
        data-cart-item-update
      />
    </div>
  );
};

const ProductItem = ({
  currency,
  deleteItem,
  item: {
    name,
    item_id,
    price_incl_tax,
    qty,
    isDeleting,
    product_url,
    image_url,
  },
}: {
  currency: string,
  deleteItem: EventHandler,
  item: CartItem,
}) => {
  return (
    <div className="product-container">
      <span className="product-image-container">
        <span className="product-image-wrapper" style={{paddingBottom: '100%'}}>
          <img
            className="product-image-photo"
            src={image_url || getConfig().productPlaceholderImage}
            onError={getSrcFallbackHandler(getConfig().productPlaceholderImage)}
            width={90}
            height={90}
            alt={name}
          />
        </span>
      </span>
      <div className="product-info product-row">
        <div>
          <a href={product_url} target="_blank">
            <span>{name}</span>
          </a>
        </div>
        <div className="control qty">
          {/* <i className="material-icons md-18">add</i> */}
          <input
            id={`cart-${item_id}-qty`}
            name={`cart[${item_id}][qty]`} // Used to get updated quantities!
            defaultValue={qty}
            type="number"
            size={4}
            title="Qty"
            min="0"
            className="input-text avarda-input-qty"
          />
          {/* <i className="material-icons md-18">remove</i> */}
        </div>
      </div>
      <div className="product-subtotal product-row">
        <div>
          <span>{formatCurrency(price_incl_tax * qty, currency)}</span>
        </div>
        <div>
          <button
            title={$.mage.__('Remove item')}
            className="avarda-action-delete"
            onClick={deleteItem}
            disabled={isDeleting}
            type="button"
          >
            <i data-itemid={item_id} className="material-icons md-18">
              remove_circle
            </i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartForm;
