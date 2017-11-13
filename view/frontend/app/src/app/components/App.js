// @flow
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect, type MapStateToProps} from 'react-redux';
import {compose} from 'redux';
import CartContainer from '$src/cart/components/CartContainer';
import ShippingContainer from '$src/shipping/components/ShippingMethodContainer';
import CartIsEmpty from './CartIsEmpty';
import {withTranslate, type Translate} from '$i18n';
import Loader from '$src/utils/components/Loader';
import {getCart, getIsCartFetching} from '$src/cart/selectors';
import {fetchCartRequest} from '$src/cart/actions';
import type {Config} from '$src/types';
import type {AppState} from '$src/root/types';
import type {Cart} from '$src/cart/types';

type Props = {
  t: Translate,
  cart: null | Cart,
  isFetching: boolean,
  config: Config,
  fetchCartRequest(): void,
};

const CartIsNotEmpty = () => [
  <CartContainer key="cart" />,
  <ShippingContainer key="shipping" />,
];

class App extends React.Component<Props> {
  componentDidMount() {
    const {fetchCartRequest, config: {hasItems}} = this.props;
    if (hasItems) {
      fetchCartRequest();
    }
  }

  render() {
    const {t, cart, isFetching, config: {hasItems}} = this.props;

    const isCartEmpty = !hasItems || (cart && cart.items.length === 0);

    return (
      <div className="app">
        <h1>{t('Checkout')}</h1>
        <Loader isLoading={cart === null && isFetching}>
          {isCartEmpty ? <CartIsEmpty /> : <CartIsNotEmpty />}
        </Loader>
      </div>
    );
  }
}

const mapStateToProps: MapStateToProps<AppState, *, *> = state => ({
  cart: getCart(state),
  isFetching: getIsCartFetching(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchCartRequest,
    },
    dispatch,
  );

export default compose(
  withTranslate,
  connect(mapStateToProps, mapDispatchToProps),
)(App);
