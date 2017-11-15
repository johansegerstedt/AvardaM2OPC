// @flow
import React, {Component} from 'react';
import AvardaCheckOutClient, {
  type InitProperties,
  type CheckOutHook,
  type CustomerInfo,
} from 'AvardaCheckOutClient';

export type Props = {
  id: string,
  purchaseId: string,
  onDone(purchaseId: string): any,
  customCssUrl?: string,
  replaceDefaultCss?: boolean,
  onBeforeSubmit?: () => boolean,
  onBeforeCompleteHook?: CheckOutHook<string>,
  onUpdateDeliveryAddressHook?: CheckOutHook<CustomerInfo>,
};

export class Avarda extends Component<Props> {
  componentDidMount() {
    AvardaCheckOutClient.init(this.getInitProperties());
  }

  getInitProperties(): InitProperties {
    const {
      id: divId,
      purchaseId,
      onDone: done,
      customCssUrl,
      replaceDefaultCss,
      onBeforeSubmit: beforeSubmit,
      onBeforeCompleteHook: beforeCompleteHook,
      onUpdateDeliveryAddressHook: updateDeliveryAddressHook,
    } = this.props;
    return {
      divId,
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
    const {id} = this.props;
    return <div id={id} />;
  }
}

export default Avarda;
