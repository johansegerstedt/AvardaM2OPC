//@flow
import React from 'react';
import {type ShippingMethod} from '$src/shipping/types';
import {$} from '$i18n';
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
  const handleClick = (event: EventHandler) => {
    event.stopPropagation();
    selectShippingMethod(method);
  };

  return (
    <li className="cards-item">
      <div
        role="button"
        className={`card ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}
        onKeyPress={handleClick}
        tabIndex={0}
      >
        <div className="card-content">
          <div className="card-title">
            {method.available ? method.method_title : null}
          </div>
          <div className="card-price">
            {formatCurrency(method.price_incl_tax, currency)}
          </div>
          <div className="card-footnote">
            {$.mage.__('Tax included')}{' '}
            <span>
              ({method.available
                ? formatCurrency(
                    formatTax(method.price_incl_tax, method.price_excl_tax),
                    currency,
                  )
                : ''})
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MethodItem;
