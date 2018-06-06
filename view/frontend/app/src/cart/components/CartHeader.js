// @flow
import React, {Fragment, Component, type Node} from 'react';

type Props = {
  children: null | Node,
  title: string,
};

type State = {
  isOpen: boolean,
};

class CartHeader extends Component<Props, State> {
  state = {
    isOpen: false,
  };

  toggle = () => this.setState(state => ({isOpen: !state.isOpen}));

  render() {
    const {isOpen} = this.state;
    const {children, title} = this.props;

    return (
      <Fragment>
        <div className="cart-discount avarda-order-review-header">
          <div
            className={`avarda-cart-items-container block discount ${
              isOpen ? ' active' : ''
            }`}
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
              onKeyPress={this.toggle}
              tabIndex={0}
            >
              <strong id="block-discount-heading" role="heading" aria-level={2}>
                {title}
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
              {children}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CartHeader;
