// @flow
import React from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '$src/utils/components/Loader';
import {withTranslate, type Translate} from '$i18n';
import {
  fetchCartRequest,
  updateCartItems,
  deleteCartItem,
  applyCoupon,
  removeCoupon,
} from '../actions';
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
  applyCoupon(code: string): void,
  removeCoupon(): void,
  t: Translate,
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
      applyCoupon,
      removeCoupon,
      t,
    } = this.props;

    const loaded = !!cart;
    return (
      <div className="cart-container">
        <Loader isLoading={!loaded}>
          {cart
            ? [
                <CartSummary
                  key="cartSummary"
                  totalSegments={cart.total_segments}
                  isLoading={isFetching || isUpdating}
                  t={t}
                />,
                <CartForm
                  key="cartForm"
                  cartItems={cartItems}
                  isUpdating={isUpdating}
                  updateCartItems={updateCartItems}
                  deleteCartItem={deleteCartItem}
                  t={t}
                />,
                <GiftOptionsCart key="giftOptionsCart" />,
                <CartDiscount
                  key="cartDiscount"
                  coupon={cart.coupon_code}
                  applyCoupon={applyCoupon}
                  removeCoupon={removeCoupon}
                  t={t}
                />,
              ]
            : null}
        </Loader>
      </div>
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
    {
      fetchCartRequest,
      updateCartItems,
      deleteCartItem,
      applyCoupon,
      removeCoupon,
    },
    dispatch,
  );

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslate,
)(Cart);
