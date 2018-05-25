//@flow
import React from 'react';
import {type ShippingMethod} from '$src/shipping/types';
import {formatCurrency, formatTax} from '$src/utils/format';
type Props = {
  method: ShippingMethod,
  selectShippingMethod(ShippingMethod): void,
  isSelected: boolean,
  currency: string,
};
const MethodItem = ({
  method,
  currency,
  selectShippingMethod,
  isSelected,
}: Props) => {
  const handleClick: EventHandler = event => {
    event.stopPropagation();
    selectShippingMethod(method);
  };

  return (
    <li className="cards__item">
      <a
        role="button"
        className={`card ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}
      >
        <div className="card__content">
          <div className="card__title">
            {method.available ? method.method_title : null}
          </div>
          <p className="card__text">
            {method.carrier_title}
            ({method.available
              ? formatCurrency(
                  formatTax(method.price_incl_tax, method.price_excl_tax),
                  currency,
                )
              : ' '})
          </p>
        </div>
      </a>
    </li>
  );
};

export default MethodItem;
