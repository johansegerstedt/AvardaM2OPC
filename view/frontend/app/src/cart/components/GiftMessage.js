// @flow
import React from 'react';
import KoBindScope from '$src/utils/components/KoBindScope';

/**
 * Documentation for this module is
 * http://docs.magento.com/m2/ee/user_guide/sales/gift-options.html
 */
const GiftMessage = () => {
  return (
    <KoBindScope
      scope="gift-message"
      divProps={{
        className: 'gift-message',
      }}
    />
  );
};

export default GiftMessage;
