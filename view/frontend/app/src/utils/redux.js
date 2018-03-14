// @flow

export const PayloadCreators = {
  createError: (err: Error): Error => err,
  createNumber: (num: number): number => num,
  createString: (str: string): string => str,
  createVoid: (): void => {},
};
