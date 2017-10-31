// @flow
import React from 'react';
import {get} from 'lodash';

type Props = {
  coupon?: string,
  applyCoupon(code: string): void,
  removeCoupon(): void,
};

type State = {
  isOpen: boolean,
};

class CartDiscount extends React.Component<Props, State> {
  state = {
    isOpen: typeof this.props.coupon === 'string',
  };

  toggle = () => this.setState(state => ({...state, isOpen: !state.isOpen}));

  applyCoupon = () => {
    const {coupon, applyCoupon} = this.props;
    if (typeof coupon === 'string') {
      applyCoupon(coupon);
    }
  };

  handleSubmit: EventHandler = event => {
    const {coupon, applyCoupon, removeCoupon} = this.props;

    event.preventDefault();
    const form = event.target;
    const code = get(form, 'coupon_code.value', '');

    if (typeof coupon === 'string') {
      removeCoupon();
    } else {
      applyCoupon(code);
    }
  };

  render() {
    const {isOpen} = this.state;
    const {coupon} = this.props;

    const isApplying: boolean = typeof coupon !== 'string';

    return (
      <div className="cart-discount">
        <div
          className={`block discount${isOpen ? ' active' : ''}`}
          id="block-discount"
          data-collapsible="true"
          role="tablist"
        >
          <div
            className="title"
            data-role="title"
            role="tab"
            aria-selected="false"
            aria-expanded={JSON.stringify(isOpen)}
            onClick={this.toggle}
            tabIndex={0}
          >
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
            style={{display: isOpen ? 'block' : 'none'}}
          >
            <form id="discount-coupon-form" onSubmit={this.handleSubmit}>
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
                      key={coupon}
                      type="text"
                      className="input-text"
                      id="coupon_code"
                      name="coupon_code"
                      defaultValue={isApplying ? '' : coupon}
                      disabled={!isApplying}
                      placeholder="Enter discount code"
                    />
                  </div>
                </div>
                <div className="actions-toolbar">
                  <div className="primary">
                    {(({label}) => (
                      <button
                        className="action apply primary"
                        type="submit"
                        value={label}
                      >
                        <span>{label}</span>
                      </button>
                    ))({
                      label: isApplying ? 'Apply Discount' : 'Cancel Coupon',
                    })}
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
