// @flow
import React, {Component} from 'react';
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

class PostCode extends Component<Props, State> {
  state = {};
  handleSubmit = (event: EventHandler) => {
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
  handleChange = (event: EventHandler) => {
    const {value} = event.target;
    event.preventDefault();
    if (value.length === 5) {
      this.handleSubmit(event);
    }
    this.setState({postCode: value});
  };

  render() {
    const {shippingAddress, controlled} = this.props;
    const {postcode} = shippingAddress;
    const disabled = controlled && !!postcode;
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
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default PostCode;
