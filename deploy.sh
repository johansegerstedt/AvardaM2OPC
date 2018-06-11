#!/usr/bin/env bash
set -e
# if [ "$EUID" -ne 0 ]
#   then echo "Please run as root"
#   exit
# fi

echo 'Fetching tags ...'
git fetch --tags

echo 'Clearning all modified files ...'
git checkout .

LATEST_TAG=$(git tag | tail -1)

echo "Checkout latest tag is ${LATEST_TAG}"
git checkout tags/$LATEST_TAG

echo 'Building the app ...'
cd view/frontend/app/
yarn build

echo 'Clear caches and all magento stuff ...'

cd /var/www/html/magento2opc/

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