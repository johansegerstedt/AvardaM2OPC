// @flow
import * as React from 'react';
import spinner from './spinner.gif';
import {withTranslate, type Translate} from '$i18n';

type Props = {
  isLoading: boolean,
  children: null | React.Node,
  block: boolean,
  t: Translate,
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
    const {isLoading, children, t, block} = this.props;
    return isLoading ? (
      <Spinner alt={t('Loading...')} block={block} />
    ) : (
      children
    );
  }
}

export default withTranslate(Loader);
