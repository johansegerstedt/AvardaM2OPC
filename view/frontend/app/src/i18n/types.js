// @flow

export type Translate = (string, ...args: Array<any>) => string;

export type TranslateContext = {
  t: Translate,
};
