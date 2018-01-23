// @flow

let additionalContent = {};

export const REGION_KEYS = {
  SHIPPING: 'shippingAdditional',
};

export const setRegions = (newAdditionalContent: Object): void => {
  additionalContent = newAdditionalContent;
};

export const getRegion = (key: string): * => additionalContent[key];
