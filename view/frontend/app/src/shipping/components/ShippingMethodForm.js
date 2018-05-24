// @flow

import React, {Component} from 'react';
import {isEqual} from 'lodash';
import AdditionalContent from '$src/utils/components/AdditionalContentRegions';
import {REGION_KEYS} from '$src/additionalContentRegions';
import {$} from '$i18n';
import type {BillingAddress} from '$src/cart/types';
import type {ShippingMethod} from '$src/shipping/types';
import Loader from '$src/utils/components/Loader';
import ShippingMethodRadio from '$src/shipping/components/ShippingMethodRadio';
import {selectMethod, saveShippingInformation} from '$src/shipping/actions';

type Props = {
  shippingAddress: BillingAddress,
  selectedShippingMethod: null | ShippingMethod,
  fetchShippingMethods(BillingAddress): void,
  selectShippingMethod(ShippingMethod): void,
  saveShippingInformation(): void,
  currency: string,
  methods: null | ShippingMethod[],
  isFetchingMethods: boolean,
};

class ShippingMethodForm extends Component<Props> {
  static defaultProps = {
    estimateShippingMethods: () => {},
    selectShippingMethod: () => {},
    isFetchingMethods: false,
  };

  handleSubmit = (event: EventHandler) => {
    const {saveShippingInformation} = this.props;
    event.preventDefault();

    saveShippingInformation();
  };
  render() {
    const {
      currency,
      methods,
      selectShippingMethod,
      isFetchingMethods,
      selectedShippingMethod,
    } = this.props;
    // 2) methods.length > 0 => regular
    // 3) methods.length === 0 => Error: No Shipping methods available
    // let moreThanOneMethod = true;
    // if (methods) {
    //   moreThanOneMethod = methods.length > 1 ? true : false;
    // }
    return (
      <Loader isLoading={isFetchingMethods}>
        <form
          className="form methods-shipping"
          id="co-shipping-method-form"
          noValidate="novalidate"
          // onSubmit={this.handleSubmit}
        >
          <div id="checkout-shipping-method-load">
            <div className="step-title">{$.mage.__('Shipping Methods')}</div>
            <table className="table-checkout-shipping-method">
              <thead>
                <tr className="row">
                  <th className="col col-method">
                    {$.mage.__('Select Method')}
                  </th>
                  <th className="col col-price">{$.mage.__('Price')}</th>
                  <th className="col col-tax">{$.mage.__('Tax')}</th>
                  <th className="col col-method">
                    {$.mage.__('Method Title')}
                  </th>
                  <th className="col col-carrier">
                    {$.mage.__('Carrier Title')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {methods &&
                  methods.map((method, index) => {
                    const value = `${
                      method.carrier_code
                    }_${method.method_code || ''}`;
                    return (
                      <ShippingMethodRadio
                        key={value}
                        value={value}
                        method={method}
                        currency={currency}
                        index={index}
                        selectShippingMethod={selectShippingMethod}
                        isSelected={isEqual(method, selectedShippingMethod)}
                      />
                    );
                  })}
              </tbody>
            </table>
          </div>
          <AdditionalContent
            id="onepage-checkout-shipping-method-additional-load"
            region={REGION_KEYS.SHIPPING}
          />
        </form>
      </Loader>
    );
  }
}
export default ShippingMethodForm;
