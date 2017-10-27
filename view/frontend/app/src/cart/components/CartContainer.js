// @flow
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchCartRequest, updateCartItems} from '../actions';
import {getAllCartItems, getCart} from '../selectors';
import CartSummary from './CartSummary';
import CartForm from './CartForm';
import CartDiscount from './CartDiscount';
import type {Cart as CartType, CartItem} from '../types';

type Props = {
  cart: null | CartType,
  cartItems: CartItem[],
  fetchCartRequest(): void,
  updateCartItems(CartItem[]): void,
};

// TODO
const GiftOptionsCart = () => (
  <div id="gift-options-cart" data-bind="scope:'giftOptionsCart'" />
);

class Cart extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchCartRequest();
  }

  render() {
    // eslint-disable-next-line no-console
    console.log(this.props);
    const {cart, cartItems, updateCartItems} = this.props;

    return cart ? (
      <div className="cart-container">
        <CartSummary />
        <CartForm cartItems={cartItems} updateCartItems={updateCartItems} />
        <GiftOptionsCart />
        <CartDiscount />
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const mapStateToProps = state => ({
  cart: getCart(state),
  cartItems: getAllCartItems(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({fetchCartRequest, updateCartItems}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
