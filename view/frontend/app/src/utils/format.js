// @flow
import {getConfig} from '$src/config';

// 'fi_FI' => 'fi-FI' as IETF format is
const magentoToIETFLanguageTagConverter = (locale: string) =>
  locale.replace(/_/g, '-');

export const formatCurrency = (
  amount: any,
  currency: string, // currency code eg. 'USD'
  locale?: string = magentoToIETFLanguageTagConverter(
    getConfig().magentoLocale,
  ),
): string => {
  return (typeof amount === 'number' ? amount : 0).toLocaleString(locale, {
    style: 'currency',
    currency,
  });
};

export const formatTax = (
  price_including_tax: number,
  price_excluding_tax: number,
): number => {
  let tax = price_including_tax - price_excluding_tax;
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Unary_plus
  tax = +tax.toFixed(2);
  return tax;
};
