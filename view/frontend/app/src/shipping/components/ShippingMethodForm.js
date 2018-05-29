// @flow

import React, {Component, Fragment} from 'react';
import {isEqual} from 'lodash';
import AdditionalContent from '$src/utils/components/AdditionalContentRegions';
import {REGION_KEYS} from '$src/additionalContentRegions';
import {$} from '$i18n';
import type {BillingAddress} from '$src/cart/types';
import type {ShippingMethod} from '$src/shipping/types';
import Loader from '$src/utils/components/Loader/Loader';
import ShippingMethodRadio from '$src/shipping/components/ShippingMethodRadio';
import {selectMethod, saveShippingInformation} from '$src/shipping/actions';
import Methods from '$src/shipping/components/Methods/Methods';

type Props = {
  shippingAddress: BillingAddress,
  selectedShippingMethod: null | ShippingMethod,
  selectShippingMethod(ShippingMethod): void,
  fetchShippingMethods(BillingAddress): void,
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
    // 1) methods.length === 1 => auto-select
    // 2) methods.length > 0 => regular
    // 3) methods.length === 0 => Error: No Shipping methods available

    return (
      <Fragment>
        <Loader show={isFetchingMethods} height={200}>
          <div id="checkout-shipping-method-load">
            {/* <div className="step-title">{$.mage.__('Shipping Methods')}</div> */}
            <Methods
              selectShippingMethod={selectShippingMethod}
              selectedShippingMethod={selectedShippingMethod}
              methods={methods}
              currency={currency}
            />
          </div>
        </Loader>
        <AdditionalContent
          id="onepage-checkout-shipping-method-additional-load"
          region={REGION_KEYS.SHIPPING}
        />
      </Fragment>
    );
  }
}
export default ShippingMethodForm;
