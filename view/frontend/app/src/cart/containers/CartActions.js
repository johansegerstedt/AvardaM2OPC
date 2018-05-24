// @flow
import React from 'react';
import {getConfig} from '$src/config';
import {$} from '$i18n';

const CartActions = ({isUpdating}: {isUpdating: boolean}) => {
  const {continueShoppingUrl} = getConfig();

  const goToHome: EventHandler = event => {
    event.preventDefault();
    window.location = continueShoppingUrl;
  };
  return (
    <div className="cart main actions cart-actions">
      <button
        type="submit"
        name="update_cart_action"
        value="update_qty"
        disabled={!!isUpdating}
        title={$.mage.__('Update')}
        className="action update primary"
      >
        <i className="material-icons md-18">done</i>
      </button>
      <button
        name="update_cart_action"
        data-cart-empty
        value="empty_cart"
        title={$.mage.__('Clear')}
        className="action clear"
        id="empty_cart_button"
      >
        <i className="material-icons md-18">clear</i>
      </button>
      <button
        name="continue_shopping"
        onClick={goToHome}
        data-cart-empty
        value="continue_shopping"
        title={$.mage.__('Continue shopping')}
        className="action"
        id="continue_shopping"
      >
        <i className="material-icons md-18">shop</i>
      </button>
      <input
        type="hidden"
        defaultValue
        id="update_cart_action_container"
        data-cart-item-update
      />
    </div>
  );
};

export default CartActions;
