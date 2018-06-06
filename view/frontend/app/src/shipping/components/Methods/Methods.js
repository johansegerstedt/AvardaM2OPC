// @flow
import React, {Fragment} from 'react';
import isEqual from 'lodash/isEqual';
import {$} from '$i18n';
import MethodItem from '$src/shipping/components/Methods/MethodItem';
import {type ShippingMethod} from '$src/shipping/types';

type Props = {
  methods: null | ShippingMethod[],
  currency: string,
  selectedShippingMethod: null | ShippingMethod,
  selectShippingMethod(ShippingMethod): void,
};
const Methods = ({
  methods,
  currency,
  selectedShippingMethod,
  selectShippingMethod,
}: Props) => {
  if (!methods) {
    return null;
  }
  const methodItems = methods.map((method, i) => (
    <MethodItem
      key={i}
      selectShippingMethod={selectShippingMethod}
      method={method}
      currency={currency}
      isSelected={isEqual(method, selectedShippingMethod)}
    />
  ));
  return (
    <Fragment>
      <ul className="cards">{methodItems}</ul>
      <span className="input-helper">
        {$.mage.__('How do you want your items to be delivered?')}
      </span>
    </Fragment>
  );
};

export default Methods;
