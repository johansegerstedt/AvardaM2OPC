// @flow
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchCartRequest} from '../actions';

type Props = {
  cart: ?{id: string},
  fetchCartRequest(): void,
};

class Cart extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchCartRequest();
  }

  render() {
    const {cart} = this.props;

    return (
      <h1>
        {typeof cart !== 'undefined' && cart !== null
          ? cart.id
          : 'Already and still missing the cart :('}
      </h1>
    );
  }
}

const mapStateToProps = ({cart: {cart}}) => ({
  cart,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({fetchCartRequest}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
