// @flow
import * as React from 'react';

type Props = {
  isLoading: boolean,
  children: React.Node,
};

const Spinner = () => <span className="avardaCheckout-spinner">...</span>;

class Loader extends React.Component<Props> {
  render() {
    const {isLoading, children} = this.props;
    return isLoading ? <Spinner /> : children;
  }
}

export default Loader;
