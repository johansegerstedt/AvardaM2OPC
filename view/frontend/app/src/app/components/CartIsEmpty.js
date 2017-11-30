// @flow
import React from 'react';
import $, {interpolateHTML} from '$i18n';
import {getConfig} from '$src/config';

const CartIsEmpty = () => (
  <div className="cart-empty">
    <p>{$.mage.__('You have no items in your shopping cart.')}</p>
    <p
      dangerouslySetInnerHTML={interpolateHTML(
        $.mage.__('Click <a href="%1">here</a> to continue shopping.'),
        getConfig().baseUrl,
      )}
    />
  </div>
);

export default CartIsEmpty;
