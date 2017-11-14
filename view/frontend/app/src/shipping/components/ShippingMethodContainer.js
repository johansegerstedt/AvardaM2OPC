// @flow
import React from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {withTranslate, type Translate} from '$i18n';
import {
  getShippingAddress,
  getQuoteCurrency,
  getIsCartUpdating,
  getIsCartFetching,
  getSelectedShippingMethodValue,
} from '$src/cart/selectors';
import {isString} from '$src/utils/h';
import {
  getShippingMethods,
  getIsFetchingShippingMethods,
  getSelectedMethod,
} from '../selectors';
import ShippingPolicy from './ShippingPolicy';
import ShippingMethodForm from './ShippingMethodForm';
import ShippingAddressForm from './ShippingAddressForm';
import {
  updateShippingAddressRequest,
  estimateShippingMethodsRequest,
  setShippingInformationRequest,
} from '../actions';
import type {BillingAddress} from '$src/cart/types';
import type {ShippingMethod as ShippingMethodType} from '../types';

// TODO: How to play nice with HOC and props?
type Props = {
  methods: null | ShippingMethodType[],
  shippingAddress: null | BillingAddress,
  currency: null | string,
  t: Translate,
  estimateShippingMethods({
    address: BillingAddress,
    methodValue: string,
  }): void,
  updateShippingAddress(BillingAddress): void,
  setShippingInformation({
    shipping_address: BillingAddress,
    shipping_method: ShippingMethodType,
  }): void,
  isFetchingMethods: boolean,
  selectedShippingMethod: null | ShippingMethodType,
  selectedShippingMethodValue: null | string,
};

class ShippingMethod extends React.Component<Props> {
  selectShippingMethod = (shipping_method: ShippingMethodType) => {
    const {shippingAddress: shipping_address} = this.props;
    if (shipping_address !== null) {
      this.props.setShippingInformation({
        shipping_address,
        shipping_method,
      });
    }
  };

  fetchShippingMethods = (address: BillingAddress) => {
    const {estimateShippingMethods, selectedShippingMethodValue} = this.props;
    if (isString(selectedShippingMethodValue)) {
      estimateShippingMethods({
        address,
        methodValue: selectedShippingMethodValue,
      });
    }
  };

  updateShippingAddress = (address: BillingAddress) => {
    this.props.updateShippingAddress(address);
  };

  render() {
    const {
      shippingAddress,
      currency,
      updateShippingAddress,
      methods,
      t,
      isFetchingMethods,
      selectedShippingMethod,
    } = this.props;
    return (
      <div className="checkout-shipping-method opc-wrapper">
        <h2 className="step-title">{t('Shipping Methods')}</h2>
        <ShippingPolicy t={t} />
        <div
          id="checkout-step-shipping"
          className="step-content"
          data-role="content"
        >
          {shippingAddress && (
            <ShippingAddressForm
              t={t}
              handleSubmit={this.updateShippingAddress}
              shippingAddress={shippingAddress}
            />
          )}
          {/* Submit this to estimate shipping methods */}
        </div>
        <div
          id="checkout-step-shipping_method"
          className="step-content"
          data-role="content"
          role="tabpanel"
          aria-hidden="false"
        >
          {shippingAddress && currency ? (
            <ShippingMethodForm // Submit this to select shipping method
              shippingAddress={shippingAddress}
              selectShippingMethod={this.selectShippingMethod}
              selectedShippingMethod={selectedShippingMethod}
              methods={methods}
              currency={currency}
              fetchShippingMethods={this.fetchShippingMethods}
              updateShippingAddress={updateShippingAddress}
              t={t}
              isFetchingMethods={isFetchingMethods}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currency: getQuoteCurrency(state),
  shippingAddress: getShippingAddress(state),
  isUpdating: getIsCartUpdating(state),
  isFetching: getIsCartFetching(state),
  isFetchingMethods: getIsFetchingShippingMethods(state),
  methods: getShippingMethods(state),
  selectedShippingMethod: getSelectedMethod(state),
  selectedShippingMethodValue: getSelectedShippingMethodValue(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      estimateShippingMethods: estimateShippingMethodsRequest,
      updateShippingAddress: updateShippingAddressRequest,
      setShippingInformation: setShippingInformationRequest,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
export default compose(connector, withTranslate)(ShippingMethod);
