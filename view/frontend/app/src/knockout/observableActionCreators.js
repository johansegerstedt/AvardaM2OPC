// @flow
import quote from 'Magento_Checkout/js/model/quote';
import * as AddressConverter from 'Magento_Checkout/js/model/address-converter';

import {selectMethod, updateAddress} from '$src/shipping/actions';

import type {BillingAddress} from '$src/cart/types';
import type {ShippingMethod} from '$src/shipping/types';

const subscriptions: * = [
  {
    observable: quote.shippingAddress,
    actionCreator: (address: ?Object) => {
      const formattedAddress: BillingAddress = AddressConverter.quoteAddressToFormAddressData(
        address,
      );
      return updateAddress(formattedAddress);
    },
  },
  {
    observable: quote.shippingMethod,
    actionCreator: (method: ShippingMethod) => selectMethod(method),
  },
];

export default subscriptions;
