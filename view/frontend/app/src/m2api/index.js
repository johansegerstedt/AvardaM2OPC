// @flow
import 'whatwg-fetch';
import qs from 'query-string';
import config from '$src/config';
import {CREDENTIALS, HEADERS} from './constants';

const {baseUrl} = config;
const M2_REST_BASE = `${baseUrl}rest`;

type Serializeable = string | number | Object | Array<any> | boolean | null;

const callApi = async (url: string, init?: RequestOptions) => {
  const mergedInit: RequestOptions = {
    credentials: CREDENTIALS,
    headers: HEADERS,
    ...init,
  };

  const apiRequest = new Request(url, mergedInit);
  return fetch(apiRequest).then(data => data.json());
};

export const getApiUrl = (path: string, query?: Object): string =>
  [
    M2_REST_BASE,
    path,
    typeof query !== 'undefined' && query !== null
      ? `?${qs.stringify(query)}`
      : '',
  ].join('');

export const apiGet = (url: string) => callApi(url, {method: 'GET'});

export const apiPost = (url: string, data: Serializeable) =>
  callApi(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const apiPut = (url: string, data: Serializeable) =>
  callApi(url, {method: 'PUT', body: JSON.stringify(data)});

export const apiDelete = (url: string) => callApi(url, {method: 'DELETE'});
