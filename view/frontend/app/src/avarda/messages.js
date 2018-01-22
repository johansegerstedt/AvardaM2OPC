// @flow
import {$} from '$i18n';
import {MessageTypes} from '$src/utils/components/Message';
import type {Message} from '$src/utils/types';

export const SelectShippingMethod: Message = {
  type: MessageTypes.NOTICE,
  message: $.mage.__('Please select a shipping method...'),
};

export const InvalidShippingAddress: Message = {
  type: MessageTypes.ERROR,
  message: `${$.mage.__(
    'Unable to save address. Please check input data.',
  )}\n${$.mage.__('Please check shipping address information.')}`,
};
