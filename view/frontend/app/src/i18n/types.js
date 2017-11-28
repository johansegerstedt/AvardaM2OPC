// @flow
import jQuery from 'jquery';

export type Translate = string => string;

export type Interpolate = (string, ...args: Array<any>) => string;

export type InterpolateHTML = (
  string,
  ...args: Array<any>
) => {
  __html: string,
};

export type TranslateContext = {
  $: typeof jQuery,
  interpolate: Interpolate,
  interpolateHTML: InterpolateHTML,
};
