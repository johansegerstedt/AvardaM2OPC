// @flow
import {getConfig} from '$src/config';

const magentoToIETFLanguageTagConverter = (locale: string) =>
  locale.replace(/_/g, '-');

export const formatCurrency = (
  number: number,
  currency: string,
  locale?: string = magentoToIETFLanguageTagConverter(
    getConfig().magentoLocale,
  ),
): string =>
  number.toLocaleString(locale, {
    style: 'currency',
    currency,
  });
