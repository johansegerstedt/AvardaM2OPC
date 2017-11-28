// @flow
import React from 'react';
import {get} from 'lodash';
import $ from '$i18n';
import type {BillingAddress} from '$src/cart/types';

type Props = {
  shippingAddress: BillingAddress,
  handleSubmit(BillingAddress): void,
};

class ShippingAddressForm extends React.Component<Props> {
  handleSubmit: EventHandler = event => {
    event.preventDefault();
    const {shippingAddress, handleSubmit} = this.props;

    const form = event.target;
    const postcode = get(form, 'postcode.value', shippingAddress.postcode);
    const country_id = 'FI'; // TODO: prolly needs own input for this

    handleSubmit({
      ...shippingAddress,
      postcode,
      country_id,
    });
  };

  render() {
    const {shippingAddress} = this.props;
    return (
      <form
        className="form form-shipping-address"
        id="co-shipping-form"
        data-hasrequired="* Required Fields"
        onSubmit={this.handleSubmit}
      >
        <div id="shipping-new-address-form" className="fieldset address">
          <div className="field _required" name="shippingAddress.postcode">
            <label className="label" htmlFor="postcode">
              <span>{$.mage.__('Zip/Postal Code')}</span>
            </label>
            <div className="control">
              <input
                className="input-text"
                type="text"
                id="postcode"
                name="postcode"
                defaultValue={shippingAddress.postcode}
              />
            </div>
          </div>
          <div className="fieldset">
            <div className="control">
              <button type="submit">
                {$.mage.__('Update')} {$.mage.__('Zip/Postal Code')}
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default ShippingAddressForm;
