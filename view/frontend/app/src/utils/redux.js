// @flow
import merge from 'lodash/merge';

export const PayloadCreators = {
  createError: (err: Error): Error => err,
  createNumber: (num: number): number => num,
  createString: (str: string): string => str,
  createVoid: (): void => {},
};

export const mergeReducers = (...reducers: Function[]) => (
  state: Object = {},
  action: *,
) =>
  reducers.reduce(
    (state, reducer) => merge({}, state, reducer(state, action)),
    state,
  );
