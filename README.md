# Digia_AvardaCheckout
Single page application checkout with integrated Avarda payment.

## Frontend development instructions

### Requirements

- Node.js
- yarn

### Getting started

```shell
cd view/frontend/app
yarn
yarn start
```

Checkout application is compiled when files are changed and the checkout is now available at `/avardacheckout` route. Compiled bundle is located in `view/frontend/web/js/bundle.js`.

### Production build
To get production ready version of the frontend do

```shell
cd view/frontend/app
yarn build
```

Successful build creates an application bundle to `view/frontend/web/js/bundle.js`. Make sure to include that when exporting the module!

In production `view/frontend/app` directory is not needed. It contains only the source codes for development.

#### Analyzing bundle size and contents

`build:analyze` script in `package.json` will create production ready bundle and open Bundle Analyzer in browser.

```shell
cd view/frontend/app
yarn build:analyze
```

## Limitations / Technical Debt

### Addresses

- Selecting a region is not supported.
- Finland is the only supported country (hard coded value).
