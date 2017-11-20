// @flow
import React from 'react';
import {type Translate} from '$i18n';

type Props = {
  t: Translate,
};

// TODO
class ShippingPolicy extends React.Component<Props> {
  render() {
    const {t} = this.props;
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
          {t('See our Shipping Policy')}
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
