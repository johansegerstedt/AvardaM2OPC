// @flow
import React from 'react';
import {get} from 'lodash';
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
    const postcode = get(form, 'postcode.value', shippingAddress.postcode);
    const country_id = 'FI'; // TODO: prolly needs own input for this

    handleSubmit({
      ...shippingAddress,
      postcode,
      country_id,
    });
  };

  render() {
    const {t, shippingAddress} = this.props;
    return (
      <form
        className="form form-shipping-address"
        id="co-shipping-form"
        data-hasrequired="* Required Fields"
        onSubmit={this.handleSubmit}
      >
        <div id="shipping-new-address-form" className="fieldset address">
          <div className="field _required" name="shippingAddress.postcode">
            <label className="label" htmlFor="PBJUWJR">
              <span data-bind="text: element.label">
                {t('Zip/Postal Code')}
              </span>
            </label>
            <div className="control">
              <input
                className="input-text"
                type="text"
                name="postcode"
                defaultValue={shippingAddress.postcode}
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
