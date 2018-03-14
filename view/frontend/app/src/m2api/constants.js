// @flow

// Required credentials to use Magento 2 Web API
export const CREDENTIALS: CredentialsType = 'same-origin';

// Required headers to use Magento 2 Web API
export const HEADERS: {[string]: string} = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};
