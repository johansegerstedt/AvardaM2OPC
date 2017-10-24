// @flow

export type Action<Type: $Subtype<string>, Payload> = {|
  type: Type,
  payload?: Payload,
  error?: ?boolean,
  meta?: any,
|};
