// @flow
import {getConfig} from '$src/config';
import type {Cart} from './types';

export const getCartApiPath = () => {
  const {maskedQuoteId} = getConfig();
  return maskedQuoteId ? `/V1/guest-carts/${maskedQuoteId}` : '/V1/carts/mine';
};

export const getQuoteCurrency = ({
  currency: {quote_currency_code},
}: Cart): string => quote_currency_code;
