// @flow

export type ById<Entity> = {[string]: Entity};

export type EntitiesState<Entity> = {
  byId: null | ById<Entity>,
  isFetching: boolean,
};

export type Normalized<Entities> = {
  entities: Entities,
  result: Reference,
};

export type Config = {
  baseUrl: string,
  baseMediaUrl: string,
  maskedQuoteId: ?string,
  customerId: ?string,
};

export type Reference = string | number;
