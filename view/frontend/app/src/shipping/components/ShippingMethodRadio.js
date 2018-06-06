// @flow
import React from 'react';
import {formatCurrency, formatTax} from '$src/utils/format';
import {type ShippingMethod} from '$src/shipping/types';

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
      {/* <td className="col col-price">
        <span className="price">
          <span className="price">
            {method.available ? formatCurrency(method.amount, currency) : ' '}
          </span>
        </span>
      </td> */}
      <td className="col col-tax">
        <span className="tax">
          <span className="tax">
            ({method.available
              ? formatCurrency(
                  formatTax(method.price_incl_tax, method.price_excl_tax),
                  currency,
                )
              : ' '})
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
export default ShippingMethodRadio;
