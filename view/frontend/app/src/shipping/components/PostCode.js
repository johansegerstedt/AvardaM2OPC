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
  postCode: string,
  config: Config,
};

class PostCode extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      config: getConfig(),
      postCode: '',
    };
  }

  componentDidMount() {
    const {shippingAddress} = this.props;
    if (shippingAddress && shippingAddress['postcode']) {
      this.setState({postCode: shippingAddress.postcode});
    }
  }

  handleChange = (event: EventHandler) => {
    const {value} = event.target;
    this.setState({postCode: value});

    if (value.length === 5) {
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
          <input
            key="postCode"
            type="number"
            id="postcode"
            name="postcode"
            maxLength={5}
            placeholder={$.mage.__('Zip/Postal Code')}
            onChange={this.handleChange}
            value={postCode}
          />
          <span className="input-helper">
            {$.mage.__(
              'Please write Postal code where you would like the items to be delivered?',
            )}
          </span>
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
