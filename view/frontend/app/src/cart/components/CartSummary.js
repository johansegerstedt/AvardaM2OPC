// @flow
import React from 'react';

class CartSummary extends React.Component<*> {
  render() {
    return (
      <div className="cart-summary" style={{top: 0}}>
        <strong className="summary title">Summary</strong>
        <div
          id="block-shipping"
          className="block shipping"
          data-collapsible="true"
          role="tablist">
          <div
            className="title"
            data-role="title"
            aria-controls="block-summary"
            role="tab"
            aria-selected="false"
            aria-expanded="false"
            tabIndex={0}>
            <strong id="block-shipping-heading" role="heading" aria-level={2}>
              Estimate Shipping and Tax{' '}
            </strong>
          </div>
          <div
            id="block-summary"
            data-bind="scope:'block-summary'"
            className="content"
            data-role="content"
            aria-labelledby="block-shipping-heading"
            role="tabpanel"
            aria-hidden="true"
            style={{display: 'none'}}>
            {/* ko template: getTemplate() */}
            {/* ko foreach: {data: elems, as: 'element'} */}
            {/* ko if: hasTemplate() */}
            {/* ko template: getTemplate() */}
            {/* /ko */}
            {/* /ko */}
            {/* /ko */}
            {/* /ko */}
          </div>
        </div>
        <div
          id="cart-totals"
          className="cart-totals"
          data-bind="scope:'block-totals'">
          {/* ko template: getTemplate() */}
          {/* /ko */}
        </div>
        <ul className="checkout methods items checkout-methods-items">
          <li className="item">
            {' '}
            <button
              type="button"
              data-role="proceed-to-checkout"
              title="Proceed to Checkout"
              className="action primary checkout">
              <span>Proceed to Checkout</span>
            </button>
          </li>
          <li className="item">
            <a
              className="action multicheckout"
              href="http://avarda.box/multishipping/checkout/">
              <span>Check Out with Multiple Addresses</span>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default CartSummary;
