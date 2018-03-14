// @flow
import React, {Component} from 'react';
import AvardaCheckOutClient, {
  type InitProperties,
  type CheckOutHook,
  type CustomerInfo,
} from 'AvardaCheckOutClient';

export type Props = {
  callbackUrl: string,
  purchaseId: string,
  onDone(purchaseId: string): any,
  customCssUrl?: string,
  replaceDefaultCss?: boolean,
  onBeforeSubmit?: () => boolean,
  onBeforeCompleteHook?: CheckOutHook<string>,
  onUpdateDeliveryAddressHook?: CheckOutHook<CustomerInfo>,
};

export const DIV_ID = 'avarda-check-out-container';
/**
 * Avarda is a React component to show the Avarda payment iframe
 * @extends Component
 */
class Avarda extends Component<Props> {
  static DIV_ID = DIV_ID;

  static defaultProps = {
    callbackUrl: window.location.href,
  };

  componentDidMount() {
    AvardaCheckOutClient.init(this.getInitProperties());
  }

  getInitProperties(): InitProperties {
    const {
      purchaseId,
      onDone: done,
      callbackUrl,
      customCssUrl,
      replaceDefaultCss,
      onBeforeSubmit: beforeSubmit,
      onBeforeCompleteHook: beforeCompleteHook,
      onUpdateDeliveryAddressHook: updateDeliveryAddressHook,
    } = this.props;
    return {
      divId: Avarda.DIV_ID,
      purchaseId,
      done,
      callbackUrl,
      customCssUrl,
      replaceDefaultCss,
      beforeSubmit,
      beforeCompleteHook,
      updateDeliveryAddressHook,
    };
  }

  // Enable external DOM mutations. See:
  // https://github.com/developit/preact/wiki/External-DOM-Mutations
  shouldComponentUpdate = () => false;

  render() {
    return <div id={Avarda.DIV_ID} />;
  }
}

export default Avarda;
