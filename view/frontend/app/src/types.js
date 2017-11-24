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
  +baseMediaUrl: string,
  +baseUrl: string,
  +countryId: string,
  +customerId: ?number,
  +hasItems: boolean,
  +magentoLocale: string,
  +maskedQuoteId: ?string,
};

export type Reference = string | number;
