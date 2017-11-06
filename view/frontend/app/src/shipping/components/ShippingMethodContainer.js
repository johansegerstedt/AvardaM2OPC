// @flow
import React from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {withTranslate, type Translate} from '$i18n';
import {
  getCart,
  getIsCartUpdating,
  getIsCartFetching,
} from '$src/cart/selectors';
import {getQuoteCurrency} from '$src/cart/utils';
import {getShippingMethods} from '../selectors';
import ShippingPolicy from './ShippingPolicy';
import ShippingMethodForm from './ShippingMethodForm';
import ZipCodeForm from './ZipCodeForm';
import {estimateShippingMethodsRequest} from '../actions';
import type {BillingAddress, Cart} from '$src/cart/types';
import type {ShippingMethod as ShippingMethodType} from '../types';

// TODO: How to play nice with HOC and props?
type Props = {
  methods: ShippingMethodType[],
  cart: null | Cart,
  t: Translate,
  estimateShippingMethods(BillingAddress): void,
};

class ShippingMethod extends React.Component<Props> {
  render() {
    const {cart, estimateShippingMethods, methods, t} = this.props;
    return (
      <div className="checkout-shipping-method opc-wrapper">
        <h2 className="step-title">{t('Shipping Methods')}</h2>
        <ShippingPolicy t={t} />
        <div
          id="checkout-step-shipping"
          className="step-content"
          data-role="content"
        >
          <ZipCodeForm />
        </div>
        <div
          id="checkout-step-shipping_method"
          className="step-content"
          data-role="content"
          role="tabpanel"
          aria-hidden="false"
        >
          {cart ? (
            <ShippingMethodForm
              deliveryAddress={
                cart.extension_attributes.shipping_assignments[0].shipping
                  .address
              }
              estimateShippingMethods={estimateShippingMethods}
              methods={methods}
              currency={getQuoteCurrency(cart)}
              t={t}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cart: getCart(state),
  isUpdating: getIsCartUpdating(state),
  isFetching: getIsCartFetching(state),
  methods: getShippingMethods(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      estimateShippingMethods: estimateShippingMethodsRequest,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
export default compose(connector, withTranslate)(ShippingMethod);
