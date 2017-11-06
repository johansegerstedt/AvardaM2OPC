// @flow
import React from 'react';
import {formatCurrency} from '$src/utils/format';
import type {Translate} from '$i18n';
import type {BillingAddress, Cart} from '$src/cart/types';
import type {ShippingMethod} from '../types';

type RadioProps = {
  method: ShippingMethod,
  currency: string,
};

const ShippingMethodRadio = ({method, currency}: RadioProps) => [
  <tr key="method" className="row">
    <td className="col col-method">
      {method.available ? (
        <input
          type="radio"
          className="radio"
          defaultValue="tablerate_bestway"
          id="s_method_tablerate_bestway"
          aria-labelledby="label_method_bestway_tablerate label_carrier_bestway_tablerate"
          name="ko_unique_1"
        />
      ) : null}
    </td>
    <td className="col col-price">
      <span className="price">
        <span className="price">
          {formatCurrency(method.price_excl_tax, currency)}
        </span>
      </span>
    </td>
    <td
      className="col col-method"
      data-bind="text: method.method_title, attr: {'id': 'label_method_' + method.method_code + '_' + method.carrier_code}"
      id="label_method_bestway_tablerate"
    >
      {method.method_title}
    </td>
    <td
      className="col col-carrier"
      data-bind="text: method.carrier_title, attr: {'id': 'label_carrier_' + method.method_code + '_' + method.carrier_code}"
      id="label_carrier_bestway_tablerate"
    >
      {method.carrier_title}
    </td>
  </tr>,
  method.available ? null : (
    <tr key="error" className="row row-error">
      <td className="col col-error" colSpan={4}>
        <div className="message error">{method.error_message}</div>
        <span className="no-display">
          <input
            type="radio"
            data-bind="attr: {'value' : method.method_code, 'id': 's_method_' + method.method_code}"
            id="s_method_null"
          />
        </span>
      </td>
    </tr>
  ),
];

type Props = {
  deliveryAddress: BillingAddress,
  estimateShippingMethods(BillingAddress): void,
  currency: string,
  methods: null | ShippingMethod[],
  t: Translate,
};

class ShippingMethodForm extends React.Component<Props> {
  componentDidMount() {
    const {deliveryAddress, estimateShippingMethods} = this.props;
    // TODO: Remove hard coded country_id!
    estimateShippingMethods({...deliveryAddress, country_id: 'FI'});
  }

  render() {
    const {currency, methods, t} = this.props;
    return (
      <form
        className="form methods-shipping"
        id="co-shipping-method-form"
        noValidate="novalidate"
      >
        <div id="checkout-shipping-method-load">
          <table className="table-checkout-shipping-method">
            <thead>
              <tr className="row">
                <th className="col col-method">{t('Select Method')}</th>
                <th className="col col-price">{t('Price')}</th>
                <th className="col col-method">{t('Method Title')}</th>
                <th className="col col-carrier">{t('Carrier Title')}</th>
              </tr>
            </thead>
            <tbody>
              {methods &&
                methods.map(method => (
                  <ShippingMethodRadio
                    key={`${method.carrier_code}_${method.method_code}`}
                    method={method}
                    currency={currency}
                  />
                ))}
            </tbody>
          </table>
        </div>
        <div id="onepage-checkout-shipping-method-additional-load" />
        <div className="actions-toolbar" id="shipping-method-buttons-container">
          <div className="primary">
            <button
              data-role="opc-continue"
              type="submit"
              className="button action continue primary"
            >
              <span>
                <span>Next</span>
              </span>
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default ShippingMethodForm;
