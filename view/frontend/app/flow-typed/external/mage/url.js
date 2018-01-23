// @flow

declare module 'mage/url' {
  declare module.exports: {
    setBaseUrl(string): void,
    build(string): string,
  };
}
