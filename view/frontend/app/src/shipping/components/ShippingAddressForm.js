// @flow
import React from 'react';
import {get} from 'lodash';
import {getConfig} from '$src/config';
import type {Translate} from '$i18n';
import type {BillingAddress} from '$src/cart/types';

type Props = {
  shippingAddress: BillingAddress,
  handleSubmit(BillingAddress): void,
  t: Translate,
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
    const {t, shippingAddress} = this.props;
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
              <span>{t('Zip/Postal Code')}</span>
            </label>
            <div className="control">
              <input
                key={JSON.stringify(postcode)}
                className="input-text"
                type="text"
                id="postcode"
                name="postcode"
                value={postcode === null ? undefined : postcode}
                disabled={!!postcode}
              />
            </div>
          </div>
          <div className="fieldset">
            <div className="control">
              <button type="submit">
                {t('Update')} {t('Zip/Postal Code')}
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default ShippingAddressForm;
