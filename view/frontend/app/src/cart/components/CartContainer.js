// @flow
import React, {Fragment} from 'react';
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
import CartItems from './CartItems';
import CartForm from './CartForm';
import CartDiscount from './CartDiscount';
import type {Cart as CartType, CartItem} from '../types';

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
      <Fragment>
        <Loader isLoading={!loaded}>
          {cart
            ? [
                <CartItems
                  key="cartItems"
                  cartItems={cartItems}
                  isUpdating={isUpdatingCart}
                  updateCartItems={updateCartItems}
                  deleteCartItem={deleteCartItem}
                  currency={getQuoteCurrency(cart)}
                />,
                <CartSummary
                  key="cartSummary"
                  totalSegments={cart.total_segments}
                  isLoading={isFetching || isUpdatingCart}
                  currency={getQuoteCurrency(cart)}
                  cart={cart}
                />,
                <GiftOptionsCart key="giftOptionsCart" />,
                <CartDiscount
                  key="cartDiscount"
                  coupon={cart.coupon_code}
                  applyCoupon={applyCoupon}
                  removeCoupon={removeCoupon}
                />,
              ]
            : null}
        </Loader>
      </Fragment>
    );
  }
}

const ContainerHolder = ({
  cartItems,
  updateCartItems,
  deleteCartItem,
  isUpdatingCart,
  isFetching,
  applyCoupon,
  removeCoupon,
}: {
  cartItems: Object,
  cartItems: CartItem[],
  isUpdatingCart: boolean,
  isFetching: boolean,
  updateCartItems(CartItem[]): void,
  deleteCartItem(itemId: string): void,
  applyCoupon(code: string): void,
  removeCoupon(): void,
}) => {
  return (
    <div>
      <CartItems
        key="cartItems"
        cartItems={cartItems}
        isUpdating={isUpdatingCart}
        updateCartItems={updateCartItems}
        deleteCartItem={deleteCartItem}
        currency={getQuoteCurrency(cart)}
      />,
      <CartSummary
        key="cartSummary"
        totalSegments={cart.total_segments}
        isLoading={isFetching || isUpdatingCart}
        currency={getQuoteCurrency(cart)}
        cart={cart}
      />,
      <GiftOptionsCart key="giftOptionsCart" />,
      <CartDiscount
        key="cartDiscount"
        coupon={cart.coupon_code}
        applyCoupon={applyCoupon}
        removeCoupon={removeCoupon}
      />,
    </div>
  );
};

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
