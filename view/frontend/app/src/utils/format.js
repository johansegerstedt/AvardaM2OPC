// @flow
import {getConfig} from '$src/config';

// 'fi_FI' => 'fi-FI' as IETF format is
const magentoToIETFLanguageTagConverter = (locale: string) =>
  locale.replace(/_/g, '-');

export const formatCurrency = (
  number: any,
  currency: string, // currency code eg. 'USD'
  locale?: string = magentoToIETFLanguageTagConverter(
    getConfig().magentoLocale,
  ),
): string =>
  (typeof number === 'number' ? number : 0).toLocaleString(locale, {
    style: 'currency',
    currency,
  });
