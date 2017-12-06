// @flow
import React from 'react';
import {get} from 'lodash';
import {getConfig} from '$src/config';
import $ from '$i18n';
import type {BillingAddress} from '$src/cart/types';

type Props = {
  shippingAddress: BillingAddress,
  controlled: boolean,
  handleSubmit(BillingAddress): void,
};

class ShippingAddressForm extends React.Component<Props> {
  handleSubmit: EventHandler = event => {
    event.preventDefault();
    const {shippingAddress, handleSubmit} = this.props;

    const form = event.target;
    const postcode = get(form, 'postcode', {value: shippingAddress.postcode})
      .value;
    const country_id = getConfig().countryId; // TODO: prolly needs own input for this

    handleSubmit({
      ...shippingAddress,
      postcode,
      country_id,
    });
  };

  render() {
    const {shippingAddress, controlled} = this.props;
    const {postcode} = shippingAddress;
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
                key={JSON.stringify(controlled) + JSON.stringify(postcode)}
                className="input-text"
                type="text"
                id="postcode"
                name="postcode"
                defaultValue={!controlled && !!postcode ? postcode : undefined}
                value={!!controlled && postcode !== null ? postcode : undefined}
                disabled={controlled && !!postcode}
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
