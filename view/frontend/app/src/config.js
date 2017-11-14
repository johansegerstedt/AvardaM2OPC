// @flow
import type {Config} from '$src/types';

const INVALID_CONFIG = 'Invalid config provided!';
const MISSING_CONFIG =
  'Config is not initialized. Remember to call `setConfig` before using config parameters.';

let config: null | Config = null;

type Cond = any => boolean;

const h = {
  isString: x => typeof x === 'string',
  isVoid: x => typeof x === 'undefined',
  isNull: x => x === null,
  isNumber: x => typeof x === 'number',
  isBoolean: x => typeof x === 'boolean',
  oneOf: (...checks: Cond[]) => x => {
    for (let cond of checks) {
      if (cond(x) === true) {
        return true;
      }
    }
    return false;
  },
};

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
