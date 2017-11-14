// @flow

export const isString = (x: any): %checks => typeof x === 'string';
export const isVoid = (x: any): %checks => typeof x === 'undefined';
export const isNotVoid = (x: any): %checks => typeof x !== 'undefined';
export const isNull = (x: any): %checks => x === null;
export const isNumber = (x: any): %checks => typeof x === 'number';
export const isBoolean = (x: any): %checks => typeof x === 'boolean';
export const isFunction = (x: any): %checks => typeof x === 'function';
export const isAny = (x: any): %checks => isVoid(x) || isNotVoid(x);
export const oneOf = (...checks: Array<(any) => boolean>) => (
  x: any,
): boolean => {
  for (let cond of checks) {
    if (cond(x) === true) {
      return true;
    }
  }
  return false;
};
