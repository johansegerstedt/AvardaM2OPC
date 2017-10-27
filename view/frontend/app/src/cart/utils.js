// @flow
import config from '$src/config';

export const getCartApiPath = () =>
  config.maskedQuoteId
    ? `/V1/guest-carts/${config.maskedQuoteId}`
    : '/V1/carts/mine';
