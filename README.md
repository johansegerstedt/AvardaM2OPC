# Digia_AvardaCheckout
Single page application checkout with integrated Avarda payment.

## Frontend development instructions

### Requirements

- Node.js
- yarn

### Getting started

Having the `devMode=true` for the module run

```
cd view/frontend/app
yarn
yarn start
```

Checkout application served by webpack-dev-server is now available at `/avardacheckout` route.

### Production build
To get production ready version of the frontend do

```
cd view/frontend/app
yarn build
```

Successful build creates an application bundle to `view/frontend/web/js/bundle.js`. Make sure to include that when exporting the module!

In production `view/frontend/app` directory is not needed. It contains only the source codes for development.

## Limitations / Technical Debt

### Addresses

- Selecting a region is not supported.
- Finland is the only supported country (hard coded value).