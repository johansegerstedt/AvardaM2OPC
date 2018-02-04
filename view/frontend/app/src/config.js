// @flow
import type {Config} from '$src/types';
import * as h from '$src/utils/h';

const INVALID_CONFIG = 'Invalid config provided!';
const MISSING_CONFIG =
  'Config is not initialized. Remember to call `setConfig` before using config parameters.';

let config: null | Config = null;

export const validate = (
  foo: Object,
): {error: false, value: Config} | {error: true, value: null} => {
  const {
    baseMediaUrl,
    baseUrl,
    countryId,
    customerId,
    hasItems,
    magentoLocale,
    maskedQuoteId,
    saveOrderUrl,
    callbackUrl,
  } = foo;

  if (
    !(
      h.isString(baseMediaUrl) &&
      h.isString(baseUrl) &&
      h.isString(countryId) &&
      h.oneOf(h.isNumber, h.isVoid, h.isNull)(customerId) &&
      h.isBoolean(hasItems) &&
      h.isString(magentoLocale) &&
      h.oneOf(h.isString, h.isVoid, h.isNull)(maskedQuoteId) &&
      h.isString(saveOrderUrl) &&
      h.isString(callbackUrl)
    )
  ) {
    return {error: true, value: null};
  }

  return {
    error: false,
    value: {
      baseMediaUrl,
      baseUrl,
      countryId,
      customerId,
      hasItems,
      magentoLocale,
      maskedQuoteId,
      saveOrderUrl,
      callbackUrl,
    },
  };
};

export const setConfig = (foo: Config): void => {
  const validated = validate(foo);
  if (validated.error) {
    throw new Error(`${INVALID_CONFIG}\n${JSON.stringify(foo)}`);
  }
  config = validated.value;
};

export const getConfig = () => {
  if (config !== null) {
    return config;
  }
  throw new Error(MISSING_CONFIG);
};

export default config;
