// @flow
import jQuery from 'jquery';
// eslint-disable-next-line no-unused-vars
import _mageTranslate from 'mage/translate';
import sanitize from '@mapbox/sanitize-caja';
import {compose} from 'redux';
import type {Interpolate, InterpolateHTML} from './types';

const translator: {mage: {__: string => string}} = {
  mage: {
    __: jQuery.mage.__,
  },
};

/**
 * Function to interpolate Magento's variable placeholders
 * AFTER translation.
 * Usage: interpolate($.mage.__('Hello %1!'), 'John Doe');
 */
export const interpolate: Interpolate = (str, ...variables) =>
  variables.reduce(
    (interpolated, variable, index) =>
      interpolated.replace(`%${index + 1}`, variable),
    str,
  );

/**
 * Convenience function to sanitize phrases that must
 * be set with innerHTML, e.g. phrases that include links.
 */
export const interpolateHTML: InterpolateHTML = (...args) => ({
  __html: compose(sanitize, interpolate)(...args),
});

export * from './types';

/**
 * Usage to get phrases collected with Magento i18n CLI tool:
 *
 * import {$} from '$i18n';
 * const Foobar = () => <div>{$.mage.__('Translate this')}/>;
 */
export const $ = translator;
