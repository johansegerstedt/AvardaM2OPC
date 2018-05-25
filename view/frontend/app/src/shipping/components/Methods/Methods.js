// @flow
import React from 'react';
import {isEqual} from 'lodash';
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
      selectedShippingMethod={selectedShippingMethod}
      method={method}
      currency={currency}
      isSelected={isEqual(method, selectedShippingMethod)}
    />
  ));
  return <ul className="cards">{methodItems}</ul>;
};

export default Methods;
