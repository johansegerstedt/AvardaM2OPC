// @flow
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {$} from '$i18n';
import {
  getQuoteCurrency,
  getIsCartUpdating,
  getIsCartFetching,
  getIsVirtual,
} from '$src/cart/selectors';
import {
  getAddress as getShippingAddress,
  getShippingMethods,
  getIsFetchingShippingMethods,
  getSelectedMethod,
  getMessages,
} from '../selectors';
import {Message, Messages} from '$src/utils/components/Message';
import ShippingPolicy from './ShippingPolicy';
import ShippingMethodForm from './ShippingMethodForm';
import ShippingAddressForm from './ShippingAddressForm';
import {updateAddress, getMethods, selectMethod} from '../actions';
import {SHIPPING_ANCHOR_ID} from '../constants';
import type {BillingAddress} from '$src/cart/types';
import type {MessageState} from '$src/utils/types';
import type {ShippingMethod as ShippingMethodType} from '../types';

// TODO: How to play nice with HOC and props?
type Props = {
  methods: null | ShippingMethodType[],
  shippingAddress: null | BillingAddress,
  currency: null | string,
  messages: null | MessageState[],
  estimateShippingMethods({
    address: BillingAddress,
  }): void,
  updateShippingAddress(BillingAddress): void,
  selectShippingMethod(ShippingMethodType): void,
  isFetchingMethods: boolean,
  isVirtual: boolean,
  selectedShippingMethod: null | ShippingMethodType,
};

class ShippingMethod extends React.Component<Props> {
  fetchShippingMethods = (address: BillingAddress) => {
    const {estimateShippingMethods} = this.props;
    estimateShippingMethods({
      address,
    });
  };

  updateShippingAddress = (address: BillingAddress) => {
    this.props.updateShippingAddress(address);
  };

  render() {
    const {
      shippingAddress,
      currency,
      updateShippingAddress,
      messages,
      methods,
      isFetchingMethods,
      selectShippingMethod,
      selectedShippingMethod,
      isVirtual,
    } = this.props;

    if (isVirtual) {
      return null;
    }

    return (
      <div className="checkout-shipping-method opc-wrapper">
        <h2 id={SHIPPING_ANCHOR_ID} className="step-title">
          {$.mage.__('Shipping Methods')}
        </h2>
        {messages && (
          <Messages>
            {messages.map(({id, type, message}) => (
              <Message key={id} type={type} msg={message} />
            ))}
          </Messages>
        )}
        <ShippingPolicy />
        <div
          id="checkout-step-shipping"
          className="step-content"
          data-role="content"
        >
          {shippingAddress && (
            <ShippingAddressForm
              handleSubmit={this.updateShippingAddress}
              shippingAddress={shippingAddress}
              controlled={selectedShippingMethod !== null}
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
              selectShippingMethod={selectShippingMethod}
              selectedShippingMethod={selectedShippingMethod}
              methods={methods}
              currency={currency}
              fetchShippingMethods={this.fetchShippingMethods}
              updateShippingAddress={updateShippingAddress}
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
  messages: getMessages(state),
  isVirtual: getIsVirtual(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      estimateShippingMethods: getMethods,
      updateShippingAddress: updateAddress,
      selectShippingMethod: selectMethod,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(ShippingMethod);
