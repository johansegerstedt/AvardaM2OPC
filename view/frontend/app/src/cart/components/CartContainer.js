// @flow
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import quote from 'Magento_Checkout/js/model/quote';
import Loader from '$src/utils/components/Loader';
import {getConfig} from '$src/config';
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
import {getQuoteCurrency} from '../utils';
import CartSummary from './CartSummary';
import CartForm from './CartForm';
import CartDiscount from './CartDiscount';
import type {Cart as CartType, CartItem} from '../types';
import GiftCardAccount from './GiftCardAccount';
import GiftMessage from './GiftMessage';

type Props = {
  cart: null | CartType,
  cartItems: CartItem[],
  isUpdatingCart: boolean,
  isFetching: boolean,
  fetchCartRequest(): void,
  updateCartItems(CartItem[]): void,
  deleteCartItem(itemId: string): void,
  applyCoupon(code: string): void,
  removeCoupon(): void,
};

// TODO
const GiftOptionsCart = () => <div id="gift-options-cart" />;

class Cart extends React.Component<Props> {
  totalsSubscription = null;

  componentDidMount() {
    this.totalsSubscription = quote.totals.subscribe(() => {
      this.props.fetchCartRequest();
    });
  }

  componentWillUnMount() {
    if (this.totalsSubscription) {
      this.totalsSubscription.dispose();
    }
  }

  render() {
    const {
      cart,
      cartItems,
      updateCartItems,
      deleteCartItem,
      isUpdatingCart,
      isFetching,
      applyCoupon,
      removeCoupon,
    } = this.props;

    const {hasItems} = getConfig();

    const cartIsEmpty = !hasItems || (cart !== null && cart.items.length === 0);

    const loaded = !!cart && !cartIsEmpty;

    return (
      <div className="cart-container">
        <Loader isLoading={!loaded}>
          {cart
            ? [
                <CartSummary
                  key="cartSummary"
                  totalSegments={cart.total_segments}
                  isLoading={isFetching || isUpdatingCart}
                  currency={getQuoteCurrency(cart)}
                  cart={cart}
                />,
                <CartForm
                  key="cartForm"
                  cartItems={cartItems}
                  isUpdating={isUpdatingCart}
                  updateCartItems={updateCartItems}
                  deleteCartItem={deleteCartItem}
                  currency={getQuoteCurrency(cart)}
                />,
                <GiftOptionsCart key="giftOptionsCart" />,
                <GiftMessage key="giftMessage" />,
                <CartDiscount
                  key="cartDiscount"
                  coupon={cart.coupon_code}
                  applyCoupon={applyCoupon}
                  removeCoupon={removeCoupon}
                />,
                <GiftCardAccount key="giftCardAccount" />,
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
  isUpdatingCart: getIsCartUpdating(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
