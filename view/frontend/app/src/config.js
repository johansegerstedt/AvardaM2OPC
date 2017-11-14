// @flow
import type {Config} from '$src/types';
import * as h from '$src/utils/h';

const INVALID_CONFIG = 'Invalid config provided!';
const MISSING_CONFIG =
  'Config is not initialized. Remember to call `setConfig` before using config parameters.';

let config: null | Config = null;

export const validate = (foo: Object) => {
  const {
    maskedQuoteId,
    customerId,
    baseUrl,
    baseMediaUrl,
    magentoLocale,
    hasItems,
  } = foo;

  if (
    !(
      h.oneOf(h.isString, h.isVoid, h.isNull)(maskedQuoteId) &&
      h.oneOf(h.isNumber, h.isVoid, h.isNull)(customerId) &&
      h.oneOf(h.isString)(baseUrl) &&
      h.oneOf(h.isString)(baseMediaUrl) &&
      h.oneOf(h.isString)(magentoLocale) &&
      h.oneOf(h.isBoolean)(hasItems)
    )
  ) {
    return {error: true, value: null};
  }
  return {error: false, value: foo};
};

export const setConfig = (foo: Config): void => {
  const {error, value} = validate(foo);
  if (error) {
    throw new Error(`${INVALID_CONFIG}\n${JSON.stringify(foo)}`);
  }
  config = value;
};

export const getConfig = () => {
  if (config !== null) {
    return config;
  }
  throw new Error(MISSING_CONFIG);
};

export default config;
