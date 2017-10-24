// @flow

export type Action<Type: $Subtype<string>, Payload> = {|
  type: Type,
  payload?: Payload,
  error?: boolean,
  meta?: any,
|};

export type Config = {
  baseUrl: string,
  baseMediaUrl: string,
  maskedQuoteId: ?string,
  customerId: ?string,
};

export type Reference = string;
