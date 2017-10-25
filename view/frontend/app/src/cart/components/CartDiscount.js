// @flow
import React from 'react';

class CartDiscount extends React.Component<*> {
  render() {
    return (
      <div className="cart-discount">
        <div
          className="block discount"
          id="block-discount"
          data-collapsible="true"
          role="tablist">
          <div
            className="title"
            data-role="title"
            role="tab"
            aria-selected="false"
            aria-expanded="false"
            tabIndex={0}>
            <strong id="block-discount-heading" role="heading" aria-level={2}>
              Apply Discount Code
            </strong>
          </div>
          <div
            className="content"
            data-role="content"
            aria-labelledby="block-discount-heading"
            role="tabpanel"
            aria-hidden="true"
            style={{display: 'none'}}>
            <form
              id="discount-coupon-form"
              action="http://avarda.box/checkout/cart/couponPost/"
              method="post">
              <div className="fieldset coupon">
                <input
                  type="hidden"
                  name="remove"
                  id="remove-coupon"
                  defaultValue={0}
                />
                <div className="field">
                  <label htmlFor="coupon_code" className="label">
                    <span>Enter discount code</span>
                  </label>
                  <div className="control">
                    <input
                      type="text"
                      className="input-text"
                      id="coupon_code"
                      name="coupon_code"
                      defaultValue
                      placeholder="Enter discount code"
                    />
                  </div>
                </div>
                <div className="actions-toolbar">
                  <div className="primary">
                    <button
                      className="action apply primary"
                      type="button"
                      value="Apply Discount">
                      <span>Apply Discount</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CartDiscount;
