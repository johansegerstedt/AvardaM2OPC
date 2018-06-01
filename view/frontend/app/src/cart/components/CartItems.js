// @flow
import React, {Fragment, Component} from 'react';
import get from 'lodash/get';
import {$, interpolate} from '$i18n';
import type {CartItem} from '../types';
import ProductItem from '$src/cart/containers/ProductItem';
import CartActions from '$src/cart/containers/CartActions';

type Props = {
  cartItems: CartItem[],
  currency: string,
  deleteCartItem(itemId: string): void,
  isUpdating: boolean,
  updateCartItems(CartItem[]): void,
};
type State = {
  isOpen: boolean,
};

class CartForm extends Component<Props, State> {
  state = {
    isOpen: false,
  };

  toggleOpenCartItems = () => this.setState(state => ({isOpen: !state.isOpen}));

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
  handleSpaceAndEnter = (callback: Function) => (
    event: SyntheticKeyboardEvent<*>,
  ) => {
    const key = event.key;
    if (key === 'Enter' || ' ') {
      event.preventDefault();
      callback();
    }
  };
  render() {
    const {cartItems, currency, isUpdating} = this.props;
    const {isOpen} = this.state;
    const cartItemsLen = cartItems.length;
    const itemsPlaceholder = cartItemsLen > 1 ? 'Items' : 'Item';
    return (
      <Fragment>
        <div
          className="avarda-cart-items-container"
          id="avarda-cart-items-container"
        >
          <div className="avarda-mobile-hide">
            {/* <i className="material-icons md-orange md-48">check_circle</i> */}
            <div className="avarda-sidebar-header">
              {/* <span className="avarda-title">{$.mage.__('Order Review')}</span> */}
              <div className="block">
                <div
                  id="avarda-cart-items-trigger"
                  className="collapsable-info title"
                  data-role="title"
                  role="tab"
                  aria-selected="false"
                  aria-expanded={JSON.stringify(isOpen)}
                  onClick={this.toggleOpenCartItems}
                  onKeyPress={this.handleSpaceAndEnter(
                    this.toggleOpenCartItems,
                  )}
                  tabIndex={0}
                >
                  <span
                    id="avarda-cart-item-header"
                    role="heading"
                    aria-level={2}
                  >
                    {$.mage.__(
                      interpolate(
                        '%1 %2 in cart',
                        cartItemsLen,
                        itemsPlaceholder,
                      ),
                    )}
                    <i className="material-icons avarda-cart-item-header-icon">
                      {!isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
                    </i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            id="avarda-cart-items-content"
            className="avarda-cart-items"
            data-role="content"
            role="tabpanel"
            aria-hidden="true"
            style={{display: isOpen ? 'block' : 'none'}}
          >
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
              <CartActions isUpdating={isUpdating} />
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CartForm;
