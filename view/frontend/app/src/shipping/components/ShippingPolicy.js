// @flow
import React, {Component} from 'react';
import {$} from '$i18n';

type Props = {};

// TODO
class ShippingPolicy extends Component<Props> {
  render() {
    return (
      <div
        className="shipping-policy-block field-tooltip"
        data-bind="visible: config.isEnabled"
        style={{display: 'none'}}
      >
        <span
          className="field-tooltip-action"
          //tabIndex={0}
          data-toggle="dropdown"
          data-bind="mageInit: {'dropdown':{'activeClass': '_active'}}"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {$.mage.__('See our Shipping Policy')}
        </span>
        <div
          className="field-tooltip-content"
          data-target="dropdown"
          aria-hidden="true"
        >
          <span data-bind="html: config.shippingPolicyContent" />
        </div>
      </div>
    );
  }
}

export default ShippingPolicy;
