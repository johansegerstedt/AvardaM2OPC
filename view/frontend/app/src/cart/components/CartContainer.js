// @flow
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchCartRequest, updateCartItems, deleteCartItem} from '../actions';
import {
  getAllCartItems,
  getCart,
  getIsCartUpdating,
  getIsCartFetching,
} from '../selectors';
import CartSummary from './CartSummary';
import CartForm from './CartForm';
import CartDiscount from './CartDiscount';
import type {Cart as CartType, CartItem} from '../types';

type Props = {
  cart: null | CartType,
  cartItems: CartItem[],
  isUpdating: boolean,
  isFetching: boolean,
  fetchCartRequest(): void,
  updateCartItems(CartItem[]): void,
  deleteCartItem(itemId: string): void,
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
    const {
      cart,
      cartItems,
      updateCartItems,
      deleteCartItem,
      isUpdating,
      isFetching,
    } = this.props;

    return cart ? (
      <div className="cart-container">
        <CartSummary
          totalSegments={cart.total_segments}
          isLoading={isFetching || isUpdating}
        />
        <CartForm
          cartItems={cartItems}
          isUpdating={isUpdating}
          updateCartItems={updateCartItems}
          deleteCartItem={deleteCartItem}
        />
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
  isUpdating: getIsCartUpdating(state),
  isFetching: getIsCartFetching(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {fetchCartRequest, updateCartItems, deleteCartItem},
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
