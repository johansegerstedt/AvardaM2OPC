// @flow
import Joi from 'joi-browser';
import type {Config} from '$src/types';

const INVALID_CONFIG = 'Invalid config provided!';
const MISSING_CONFIG =
  'Config is not initialized. Remember to call `setConfig` before using config parameters.';

const configSchema = Joi.object().keys({
  maskedQuoteId: Joi.string()
    .optional()
    .allow(null),
  customerId: Joi.string()
    .optional()
    .allow(null),
  baseUrl: Joi.string().required(),
  baseMediaUrl: Joi.string().required(),
  magentoLocale: Joi.string().required(),
});

let config: null | Config = null;

export const validate = (foo: Config) => Joi.validate(foo, configSchema);

export const setConfig = (foo: Config): void => {
  const {error, value} = validate(foo);
  if (error) {
    throw new Error(INVALID_CONFIG);
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
