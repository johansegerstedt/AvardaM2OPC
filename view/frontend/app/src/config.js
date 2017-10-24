// @flow
import Joi from 'joi-browser';
import type {Config} from '$src/types';

const configSchema = Joi.object().keys({
  maskedCartId: Joi.string(),
  customerId: Joi.string(),
  baseUrl: Joi.string().required(),
  baseMediaUrl: Joi.string().required(),
});

const config: Config = window.__avarda_checkout_config__;

export const validate = (): Promise<any> =>
  new Promise((resolve, reject) => {
    Joi.validate(config, configSchema, (err, value) => {
      if (err) {
        return reject(err);
      }
      return resolve(value);
    });
  });

export default config;
