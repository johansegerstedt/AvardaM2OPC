# Digia AvardaCheckout

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

## Deployment and releasing

### Making a release

`deploy.sh` comes with the release flag `--with_release` which will do packaging in `tar.gz` file with maximum compression. Compressed file is located under root of the project.

Since the script is made with flag, later on it can be changed and used for CI/CD if needed, and automatically publishing new release to github. **TBD**

### Fiddling with deployment script

So far we are only able to do local deployments. It is very useful on testing/staging instances, it is **NOT** recommended for production use unless the script is invoked with `--with_release` which will build production ready release.

Deployment script is self explanatory and help can be found by typing

```
./deploy.sh -h
<Initial deployment script for local deployments :) >
Usage: ./deploy.sh [--checkout <arg>] [--checkout_value <arg>] [--m2path <arg>] [--(no-)with_cc] [--(no-)with_release] [-h|--help]
        --checkout: It is tag or branch (default: 'branch')
        --checkout_value: In case of tag write v1.1.1, in case of branch is a string (default: 'develop')
        --m2path: Magento2 installation path (default: '/var/www/html/magento2opc/')
        --with_cc,--no-with_cc: Should clean the cache (off by default)
        --with_release,--no-with_release: Should we  build a release (off by default)
        -h,--help: Prints help
```

Files:

- `deploy.sh` is auto-generated and it should not be modified unless it's the last resort.
- `deploy-template.sh` is the source of the `deploy.sh` and it's the place to make your changes.

##### Dependencies

We are relying on excellent shell helper utility for parsing the arguments called `argbash`.
Go to [Argbash QuickStart](https://argbash.readthedocs.io/en/stable/index.html#quickstart) website and install it.

_You can use [Docker](https://hub.docker.com/r/matejak/argbash/), [Online generator](https://argbash.io/generate) or [Local version](https://argbash.readthedocs.io/en/stable/install.html#user-install)_

##### How to change deployment script?

Open the `deploy-template.sh` and make your changes. Don't forget to save :)

Open terminal and type following ([local installation](https://argbash.readthedocs.io/en/stable/install.html#user-install)):

```sh
argbash -o deploy.sh deploy-template.sh
```

`deploy.sh` is re-generated and ready for use.
To test it you can run `./deploy.sh -h` if something fails go back, edit, save, generate, run...
