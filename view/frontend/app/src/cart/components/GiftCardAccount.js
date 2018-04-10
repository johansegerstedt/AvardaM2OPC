// @flow
import React from 'react';
import KoBindScope from '$src/utils/components/KoBindScope';

/**
 * Documentation for this module
 * http://docs.magento.com/m2/ee/user_guide/catalog/product-gift-card-accounts.html
 */
const GiftCardAccount = () => {
  return (
    <KoBindScope
      scope="gift-card"
      divProps={{
        className: 'checkout-payment-method',
      }}
    />
  );
};

export default GiftCardAccount;
