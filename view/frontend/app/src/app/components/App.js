// @flow
import React from 'react';
import {connect, type MapStateToProps} from 'react-redux';
import {compose} from 'redux';
import CartContainer from '$src/cart/components/CartContainer';
import ShippingContainer from '$src/shipping/components/ShippingMethodContainer';
import CartIsEmpty from './CartIsEmpty';
import {withTranslate, type Translate} from '$i18n';
import {getCart} from '$src/cart/selectors';
import {getConfig} from '$src/config';
import type {AppState} from '$src/root/types';
import type {Cart} from '$src/cart/types';

type Props = {
  t: Translate,
  cart: null | Cart,
};

const CartIsNotEmpty = () => [
  <CartContainer key="cart" />,
  <ShippingContainer key="shipping" />,
];

const App = ({t, cart}: Props) => {
  const {maskedQuoteId, customerId} = getConfig();
  const isCartEmpty =
    (typeof maskedQuoteId !== 'string' && typeof customerId !== 'string') ||
    (cart && cart.items.length === 0);

  return (
    <div className="app">
      <h1>{t('Checkout')}</h1>
      {isCartEmpty ? <CartIsEmpty /> : <CartIsNotEmpty />}
    </div>
  );
};

const mapStateToProps: MapStateToProps<AppState, *, *> = state => ({
  cart: getCart(state),
});

export default compose(withTranslate, connect(mapStateToProps))(App);
