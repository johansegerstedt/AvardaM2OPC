// @flow
import React, {Component} from 'react';
import {getConfig} from '$src/config';
import {$} from '$i18n';
import quote from 'Magento_Checkout/js/model/quote';
import {type BillingAddress} from '$src/cart/types';
import {type Config} from '$src/types';
import {connect} from 'react-redux';
import {compose, bindActionCreators} from 'redux';
import subscribe from '$src/knockout/components/subscribe';
import {updateAddress} from '$src/shipping/actions';

type Props = {
  shippingAddress: null | BillingAddress,
  updateShippingAddress(BillingAddress): void,
};

type State = {
  postCode?: typeof undefined | string,
  config: Config,
};

class PostCode extends Component<Props, State> {
  state = {
    config: getConfig(),
    postCode: undefined,
  };
  componentDidMount() {
    const {shippingAddress} = this.props;
    if (shippingAddress) {
      const {postcode} = shippingAddress;
      this.setState({postCode: postcode});
    }
  }
  handleChange = (event: EventHandler) => {
    const {value} = event.target;
    const vLen = value.length;

    if (vLen > 5) {
      event.preventDefault();
    } else if (vLen === 5) {
      const {shippingAddress, updateShippingAddress} = this.props;

      const country_id = this.state.config.countryId;

      updateShippingAddress({
        ...shippingAddress,
        postcode: value,
        country_id,
      });
    }
  };

  render() {
    const {postCode} = this.state;
    return (
      <div id="shipping-new-address-form" className="fieldset address">
        <div className="field _required" name="shippingAddress.postcode">
          <div className="control">
            <input
              key={JSON.stringify(postCode)}
              className="avarda-input-text"
              type="string"
              id="postcode"
              name="postcode"
              maxLength={5}
              placeholder={$.mage.__('Zip/Postal Code')}
              onChange={this.handleChange}
              value={postCode}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateShippingAddress: updateAddress,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  connector,
  subscribe({
    shippingAddress: quote.shippingAddress,
  }),
)(PostCode);
