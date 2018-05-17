// @flow
import React, {Fragment, Component} from 'react';
import queryString from 'query-string';
import {bindActionCreators} from 'redux';
import {connect, type MapStateToProps} from 'react-redux';
import {compose} from 'redux';
import CartContainer from '$src/cart/components/CartContainer';
import ShippingContainer from '$src/shipping/components/ShippingMethodContainer';
import AvardaContainer from '$src/avarda/components/AvardaCheckOutContainer';
import CartIsEmpty from './CartIsEmpty';
import {getCart, getIsCartFetching} from '$src/cart/selectors';
import {fetchCartRequest} from '$src/cart/actions';
import type {Config} from '$src/types';
import type {AppState} from '$src/root/types';
import type {Cart} from '$src/cart/types';
import Loader from '$src/utils/components/Loader';

type Props = {
  cart: null | Cart,
  isFetching: boolean,
  config: Config,
  fetchCartRequest(): void,
};

const CartIsNotEmpty = () => {
  return (
    <Fragment>
      <div className="avarda-checkout-main">
        <ShippingContainer key="shipping" />
        <AvardaContainer key="avarda" />
      </div>
      <div className="avarda-checkout-sidebar">
        <div className="side-container">
          <CartContainer key="cart" />
        </div>
      </div>
    </Fragment>
  );
};

const PaymentSuccess = () => <AvardaContainer />;

class App extends Component<Props> {
  componentDidMount() {
    const {fetchCartRequest, config: {hasItems}} = this.props;
    if (hasItems) {
      fetchCartRequest();
    }
  }

  render() {
    const {cart, config: {hasItems}, isFetching} = this.props;

    const isCartEmpty = !hasItems || (cart && cart.items.length === 0); // || cart === null;
    const isSuccess =
      queryString.parse(window.location.search).PaymentStatus === 'Success';

    if (isSuccess) {
      return <PaymentSuccess />;
    }

    return (
      <Loader isLoading={isFetching} block={true}>
        <div className="avarda-app">
          {isCartEmpty ? <CartIsEmpty /> : <CartIsNotEmpty />}
        </div>
      </Loader>
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

export default compose(connect(mapStateToProps, mapDispatchToProps))(App);
