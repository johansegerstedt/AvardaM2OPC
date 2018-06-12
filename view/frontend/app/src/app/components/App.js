// @flow
import React, {Fragment, Component} from 'react';
import queryString from 'query-string';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {$, interpolateHTML} from '$i18n';
import {getConfig} from '$src/config';
import CartContainer from '$src/cart/components/CartContainer';
import ShippingContainer from '$src/shipping/components/ShippingContainer';
import AvardaContainer from '$src/avarda/components/AvardaContainer';
import {getCart} from '$src/cart/selectors';
import type {Config} from '$src/types';
import type {AppState} from '$src/root/types';
import type {Cart} from '$src/cart/types';

type Props = {
  cart: null | Cart,
  config: Config,
};

const CartIsNotEmpty = () => {
  return (
    <Fragment>
      <div className="avarda-checkout-main">
        <ShippingContainer key="shipping" />
        <AvardaContainer key="avarda" />
      </div>
      <div className="avarda-checkout-sidebar">
        <CartContainer key="cart" />
      </div>
    </Fragment>
  );
};

const CartIsEmpty = () => (
  <div className="cart-empty">
    <div>
      <span>{$.mage.__('You have no items in your shopping cart.')}</span>
    </div>
    <div
      dangerouslySetInnerHTML={interpolateHTML(
        $.mage.__('Click <a href="%1">here</a> to continue shopping.'),
        getConfig().baseUrl,
      )}
    />
  </div>
);

const PaymentSuccess = () => <AvardaContainer />;

class App extends Component<Props, AppState> {
  render() {
    const paymentSuccessful =
      queryString.parse(window.location.search).PaymentStatus === 'Success';

    if (paymentSuccessful) {
      return <PaymentSuccess />;
    }
    const {cart, config: {hasItems}} = this.props;
    const isCartEmpty = !hasItems || (cart && cart.items.length === 0); // || cart === null;

    return (
      <div className="avarda-app">
        {isCartEmpty ? <CartIsEmpty /> : <CartIsNotEmpty />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cart: getCart(state),
  config: getConfig(),
});

export default compose(connect(mapStateToProps))(App);
