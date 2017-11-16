// @flow
import React, {Component} from 'react';
import AvardaCheckOutClient, {
  type InitProperties,
  type CheckOutHook,
  type CustomerInfo,
} from 'AvardaCheckOutClient';

export type Props = {
  purchaseId: string,
  onDone(purchaseId: string): any,
  customCssUrl?: string,
  replaceDefaultCss?: boolean,
  onBeforeSubmit?: () => boolean,
  onBeforeCompleteHook?: CheckOutHook<string>,
  onUpdateDeliveryAddressHook?: CheckOutHook<CustomerInfo>,
};

export class Avarda extends Component<Props> {
  static DIV_ID = 'avarda-check-out-container';

  componentDidMount() {
    AvardaCheckOutClient.init(this.getInitProperties());
  }

  getInitProperties(): InitProperties {
    const {
      purchaseId,
      onDone: done,
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
