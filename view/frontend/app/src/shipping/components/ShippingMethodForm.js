// @flow
import React from 'react';
import {isEqual} from 'lodash';
import {formatCurrency} from '$src/utils/format';
import Loader from '$src/utils/components/Loader';
import type {Translate} from '$i18n';
import type {BillingAddress} from '$src/cart/types';
import type {ShippingMethod} from '../types';

type RadioProps = {
  method: ShippingMethod,
  currency: string,
  selectShippingMethod(ShippingMethod): void,
  isSelected: boolean,
  value: string,
};

const ShippingMethodRadio = ({
  method,
  currency,
  isSelected,
  selectShippingMethod,
  value,
}: RadioProps) => {
  const handleClick: EventHandler = ev => {
    if (ev.type !== 'change') {
      ev.preventDefault();
    }
    // ev.stopPropagation();
    selectShippingMethod(method);
  };
  return [
    <tr key="method" className="row">
      <td className="col col-method">
        {method.available ? (
          <input
            type="radio"
            className="radio"
            defaultValue={value}
            id={value}
            name="ko_unique_1"
            onChange={handleClick}
            checked={isSelected}
          />
        ) : null}
      </td>
      <td className="col col-price">
        <span className="price">
          <span className="price">
            {method.available
              ? formatCurrency(method.price_excl_tax, currency)
              : ' '}
          </span>
        </span>
      </td>
      <td className="col col-method" id={`label_method_${value}`}>
        {method.available ? method.method_title : null}
      </td>
      <td className="col col-carrier" id={`label_carrier_${value}`}>
        {method.carrier_title}
      </td>
    </tr>,
    method.available ? null : (
      <tr key="error" className="row row-error">
        <td className="col col-error" colSpan={4}>
          <div className="message error">
            <div>{method.error_message}</div>
          </div>
          <span className="no-display">
            <input type="radio" id={`s_method_${value}`} />
          </span>
        </td>
      </tr>
    ),
  ];
};

type Props = {
  shippingAddress: BillingAddress,
  selectedShippingMethod: null | ShippingMethod,
  fetchShippingMethods(BillingAddress): void,
  selectShippingMethod(ShippingMethod): void,
  currency: string,
  methods: null | ShippingMethod[],
  isFetchingMethods: boolean,
  t: Translate,
};

class ShippingMethodForm extends React.Component<Props> {
  static defaultProps = {
    estimateShippingMethods: () => {},
    selectShippingMethod: () => {},
    isFetchingMethods: false,
  };

  componentDidMount() {
    const {shippingAddress, fetchShippingMethods} = this.props;
    if (
      shippingAddress.postcode !== null &&
      shippingAddress.country_id !== null
    ) {
      fetchShippingMethods({...shippingAddress});
    }
  }

  render() {
    const {
      currency,
      methods,
      t,
      isFetchingMethods,
      selectShippingMethod,
      selectedShippingMethod,
    } = this.props;

    if (methods === null && !isFetchingMethods) {
      return null;
    }

    // 2) methods.length > 0 => regular
    // 3) methods.length === 0 => Error: No Shipping methods available
    return (
      <Loader isLoading={isFetchingMethods || methods === null}>
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
                  methods.map((method, index) => {
                    const value = `${
                      method.carrier_code
                    }_${method.method_code || ''}`;
                    return (
                      <ShippingMethodRadio
                        key={value}
                        value={value}
                        method={method}
                        currency={currency}
                        index={index}
                        selectShippingMethod={selectShippingMethod}
                        isSelected={isEqual(method, selectedShippingMethod)}
                      />
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div id="onepage-checkout-shipping-method-additional-load" />
        </form>
      </Loader>
    );
  }
}

export default ShippingMethodForm;
