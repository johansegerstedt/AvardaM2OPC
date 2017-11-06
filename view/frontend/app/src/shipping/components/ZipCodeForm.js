// @flow
import React from 'react';
import {get} from 'lodash';

type Props = {};

class ZipCodeForm extends React.Component<Props> {
  handleSubmit: EventHandler = event => {
    event.preventDefault();

    const form = event.target;
    const postcode = get(form, 'postcode.value');
    console.log({postcode, todo: 'TODO'});
  };

  render() {
    return (
      <form
        className="form form-shipping-address"
        id="co-shipping-form"
        data-bind="attr: {'data-hasrequired': $t('* Required Fields')}"
        data-hasrequired="* Required Fields"
        onSubmit={this.handleSubmit}
      >
        <div id="shipping-new-address-form" className="fieldset address">
          <div
            className="field _required"
            data-bind="visible: visible, attr: {'name': element.dataScope}, css: additionalClasses"
            name="shippingAddress.postcode"
          >
            <label
              className="label"
              data-bind="attr: { for: element.uid }"
              htmlFor="PBJUWJR"
            >
              <span data-bind="text: element.label">Zip/Postal Code</span>
            </label>
            <div
              className="control"
              data-bind="css: {'_with-tooltip': element.tooltip}"
            >
              <input
                className="input-text"
                type="text"
                name="postcode"
                placeholder
                aria-describedby="notice-PBJUWJR"
                id="PBJUWJR"
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default ZipCodeForm;
