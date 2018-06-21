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

## Additional Content

The module provides following API to add content/functionality to the checkout page.

### Adding additional content

Additional content can be defined in `view/frontend/layout/avarda_checkout_index.xml` by modifying `"jsLayout"` argument.

### Regions for additional content

| Region key         | Description                          |
| ------------------ | ------------------------------------ |
| shippingAdditional | Area after shipping method selection |

## Limitations / Technical Debt

### Addresses

- Selecting a region is not supported.
- Finland is the only supported country (hard coded value).

### Deployment

- For now we only can deploy the latest released tag
- local deployments only

To deploy the app on the server navigate to module root and type

```sh
bash deploy.sh
# or
./deploy.sh
```

This will fetch latest TAG with latest code changes, install deps, build it and clear all caches.
