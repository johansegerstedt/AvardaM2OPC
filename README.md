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
`avardaCheckout` JS module exports a method called `execute`. `execute` takes
2 arguments: configuration and optionally object describing additional content.
Here's an example how to start AvardaCheckout single page application with
additional shipping module:

```php
<script>
require([
  'avardaCheckout',
  'Markup_Smartship/js/view/checkout/shipping/additional-block'
], function(avardaCheckout, Smartship) {
  avardaCheckout.execute(
    <?php echo json_encode($config); ?>,
    {
      shippingAdditional: Smartship
    }
  );
});
</script>
```

The second argument is an object where the keys determine the region key (see [next chapter](#regions-for-additional-content)) and the value is an `uiComponent`.

In the above example `shippingAdditional` is the region and `Smartship` is the component to render in that region.

### Regions for additional content

| Region key            | Description                          |
|-----------------------|--------------------------------------|
| shippingAdditional    | Area after shipping method selection |


## Limitations / Technical Debt

### Addresses

- Selecting a region is not supported.
- Finland is the only supported country (hard coded value).
