// @flow

export type MageTranslate = string => string;
export type Translate = (string, ...args: Array<any>) => string;
export type TranslateHTML = (
  string,
  ...args: Array<any>
) => {
  __html: string,
};

export type TranslateContext = {
  t: Translate,
  tHTML: TranslateHTML,
};
