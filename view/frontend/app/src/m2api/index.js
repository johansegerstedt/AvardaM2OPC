// @flow
import 'whatwg-fetch';
import qs from 'query-string';
import {getConfig} from '$src/config';
import {CREDENTIALS, HEADERS} from './constants';

type Serializeable = string | number | Object | Array<any> | boolean | null;

const handleErrors = (response: Response) => {
  const {statusText, ok} = response;
  if (!ok) {
    throw new Error(statusText);
  }
  return response;
};

const callApi = async (url: string, init?: RequestOptions) => {
  const mergedInit: RequestOptions = {
    credentials: CREDENTIALS,
    headers: HEADERS,
    ...init,
  };

  const apiRequest = new Request(url, mergedInit);
  return fetch(apiRequest)
    .then(handleErrors)
    .then(data => data.json())
    .catch(err => {
      throw err;
    });
};

const makeCall = (method: string) => (url: string) => callApi(url, {method});

const makePayloadCall = (method: string) => (
  url: string,
  data?: Serializeable,
) => {
  const init: RequestOptions = {method};
  if (typeof data !== 'undefined') {
    init.body = JSON.stringify(data);
  }
  return callApi(url, init);
};

export const getApiUrl = (path: string, query?: Object): string =>
  [
    `${getConfig().baseUrl}rest`,
    path,
    typeof query !== 'undefined' && query !== null
      ? `?${qs.stringify(query)}`
      : '',
  ].join('');

export const apiGet = makeCall('GET');

export const apiPost = makePayloadCall('POST');

export const apiPut = makePayloadCall('PUT');

export const apiDelete = makeCall('DELETE');
