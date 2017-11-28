// @flow
import jQuery from 'jquery';
// eslint-disable-next-line no-unused-vars
import _mageTranslate from 'mage/translate';
import sanitize from 'sanitize-caja';
import {compose} from 'redux';
import type {Interpolate, InterpolateHTML} from './types';

export const fobar: typeof jQuery = {
  mage: {
    __: compose(sanitize, jQuery.mage.__),
  },
};

export const interpolate: Interpolate = (str, ...variables) =>
  variables.reduce(
    (interpolated, variable, index) =>
      interpolated.replace(`%${index + 1}`, variable),
    str,
  );

export const interpolateHTML: InterpolateHTML = (...args) => ({
  __html: interpolate(...args),
});

export * from './types';

export default fobar;
