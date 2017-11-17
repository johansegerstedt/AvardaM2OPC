// @flow
declare module 'AvardaCheckOutClient' {
  declare type InitProperties = {
    divId: string,
    purchaseId: string,
    done: Function,
    callbackUrl?: string,
    customCssUrl?: string,
    replaceDefaultCss?: boolean,
    beforeSubmit?: Function,
    beforeCompleteHook?: CheckOutHook<string>,
    updateDeliveryAddressHook?: CheckOutHook<CustomerInfo>,
  };

  declare type Result = {
    continue(): void,
    cancel(): void,
  };

  declare type CheckOutHook<T> = (result: Result, T) => any;

  declare type CustomerInfo = {
    FirstName: string,
    LastName: string,
    Address: string,
    ZipCode: string,
    City: string,
    Country: string,
  };

  declare module.exports: {
    init: InitProperties => void,
    updateItems: () => void,
  };
}
