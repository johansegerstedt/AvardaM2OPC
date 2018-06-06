// @flow
import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import quote from 'Magento_Checkout/js/model/quote';
import subscribe from '$src/knockout/components/subscribe';
import {
  getQuoteCurrency,
  getIsCartUpdating,
  getIsCartFetching,
  getIsVirtual,
} from '$src/cart/selectors';
import {
  getShippingMethods,
  getIsFetchingShippingMethods,
  getMessages,
} from '../selectors';
import {Message, Messages} from '$src/utils/components/Message';
import ShippingPolicy from './ShippingPolicy';
import ShippingMethodForm from './ShippingMethodForm';
import PostCode from './PostCode';
import {updateAddress, getMethods, selectMethod} from '../actions';
// import {SHIPPING_ANCHOR_ID} from '../constants';
import {saveShippingInformation} from '../actions';
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
  saveShippingInformation(): void,
  selectShippingMethod(ShippingMethodType): void,
  isFetchingMethods: boolean,
  isVirtual: boolean,
  selectedShippingMethod: null | ShippingMethodType,
};

class ShippingMethod extends Component<Props> {
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
      saveShippingInformation,
      selectShippingMethod,
      selectedShippingMethod,
      isVirtual,
    } = this.props;

    if (isVirtual) {
      return null;
    }
    return (
      <div className="checkout-shipping-method avarda-step">
        {messages && (
          <Messages>
            {messages.map(({id, type, message}) => (
              <Message key={id} type={type} msg={message} />
            ))}
          </Messages>
        )}
        <ul>
          <li>
            <ShippingPolicy />
            <div
              id="checkout-step-shipping"
              className="step-content"
              data-role="content"
            >
              {shippingAddress && <PostCode key="postCode" />}
              {/* Submit this to estimate shipping methods */}
            </div>
          </li>
          <li>
            <div
              id="checkout-step-shipping_method"
              className="step-content"
              data-role="content"
              role="tabpanel"
              aria-hidden="false"
            >
              {shippingAddress && shippingAddress.postcode && currency ? (
                <ShippingMethodForm // Submit this to select shipping method
                  shippingAddress={shippingAddress}
                  selectShippingMethod={selectShippingMethod}
                  selectedShippingMethod={selectedShippingMethod}
                  methods={methods}
                  currency={currency}
                  fetchShippingMethods={this.fetchShippingMethods}
                  updateShippingAddress={updateShippingAddress}
                  isFetchingMethods={isFetchingMethods}
                  saveShippingInformation={saveShippingInformation}
                />
              ) : null}
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currency: getQuoteCurrency(state),
  isUpdating: getIsCartUpdating(state),
  isFetching: getIsCartFetching(state),
  isFetchingMethods: getIsFetchingShippingMethods(state),
  methods: getShippingMethods(state),
  messages: getMessages(state),
  isVirtual: getIsVirtual(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      estimateShippingMethods: getMethods,
      updateShippingAddress: updateAddress,
      selectShippingMethod: selectMethod,
      saveShippingInformation,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  connector,
  subscribe({
    shippingAddress: quote.shippingAddress,
    selectedShippingMethod: quote.shippingMethod,
  }),
)(ShippingMethod);
