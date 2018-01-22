// @flow
import * as React from 'react';
import {$} from '$i18n';
import spinner from './spinner.gif';

type Props = {
  isLoading: boolean,
  children: null | React.Node,
  block: boolean,
};

const Spinner = ({alt, block}: {alt: string, block: boolean}) => (
  <span
    className="avardaCheckout-spinner"
    style={block ? {display: 'block', textAlign: 'center'} : undefined}
  >
    <img src={spinner} alt={alt} />
  </span>
);

class Loader extends React.Component<Props> {
  static defaultProps = {
    block: false,
  };

  render() {
    const {isLoading, children, block} = this.props;
    return isLoading ? (
      <Spinner alt={$.mage.__('Loading...')} block={block} />
    ) : (
      children
    );
  }
}

export default Loader;
