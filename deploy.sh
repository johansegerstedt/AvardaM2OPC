#!/usr/bin/env bash
set -e

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MAGENTO2_DIR="/var/www/html/magento2opc/"

echo 'Fetching tags ...'
git fetch --tags

echo 'Clearning all modified files ...'
git checkout .

LATEST_TAG=$(git tag | tail -1)

echo "Checkout latest tag is ${LATEST_TAG}"
git checkout tags/$LATEST_TAG

cd $ROOT_DIR/view/frontend/app/

echo 'Install latest packages'
yarn 

echo 'Building the app ...'
yarn build:app

echo "AVARDA iframe style location ${ROOT_DIR}/view/frontend/web/css/avarda.css" 

echo 'Clear caches and all magento stuff ...'
cd $MAGENTO2_DIR

rm -rf var/cache/* var/page_cache/* var/di/* var/generation/* var/view_preprocessed/*
bin/magento cache:flush
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento setup:static-content:deploy -f en_US fi_FI sv_SE
bin/magento indexer:reindex
bin/magento cache:flush
bin/magento cache:clean
chmod -R 775 ./
chown -R root:www-data ./

echo '    _____   ____  _   _ ______    '
echo '   |  __ \ / __ \| \ | |  ____|   '
echo '   | |  | | |  | | . ` |  __|     '
echo '   | |__| | |__| | |\  | |____    '
echo '   |_____/ \____/|_| \_|______|   '