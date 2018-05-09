// @flow
import React from 'react';
import {getConfig} from '$src/config';
import {$} from '$i18n';
import type {BillingAddress} from '$src/cart/types';

type Props = {
  shippingAddress: BillingAddress,
  controlled: boolean,
  handleSubmit(BillingAddress): void,
};

type State = {
  postCode?: number,
};

class ShippingAddressForm extends React.Component<Props, State> {
  state = {};
  handleSubmit: EventHandler = event => {
    event.preventDefault();
    const {shippingAddress, handleSubmit} = this.props;

    const postcode = event.target.value;
    const country_id = getConfig().countryId;

    handleSubmit({
      ...shippingAddress,
      postcode,
      country_id,
    });
  };
  handleChange: EventHandler = event => {
    const {target: {value}} = event;
    event.preventDefault();
    if (value.length === 5) {
      this.handleSubmit(event);
    }
    this.setState({postCode: value});
  };

  render() {
    const {shippingAddress, controlled} = this.props;
    const {postcode} = shippingAddress;
    return (
      <form className="form form-shipping-address" id="co-shipping-form">
        <div id="shipping-new-address-form" className="fieldset address">
          <div className="step-title">{$.mage.__('Zip/Postal Code')}</div>
          <div className="field _required" name="shippingAddress.postcode">
            <div className="control">
              <input
                key={JSON.stringify(controlled) + JSON.stringify(postcode)}
                className="input-text"
                type="number"
                id="postcode"
                name="postcode"
                max="5"
                onChange={this.handleChange}
                defaultValue={!controlled && !!postcode ? postcode : undefined}
                value={!!controlled && postcode !== null ? postcode : undefined}
                disabled={controlled && !!postcode}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default ShippingAddressForm;
