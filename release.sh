#!/usr/bin/env bash
set -e

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

RELEASE_FILENAME="Digia_AvardaCheckout.tar.gz"

[ -e ${RELEASE_FILENAME} ] && rm ${RELEASE_FILENAME}

cd ${ROOT_DIR}/view/frontend/app/

echo 'Install latest packages ...'
yarn

echo 'Building the app ...'
yarn build:app

cd ${ROOT_DIR}
GZIP=-9 # maximum compression
tar --exclude='.git*' \
--exclude='./view/frontend/app' \
--exclude='.DS_Store' \
--exclude='.idea' \
-zcvf ${RELEASE_FILENAME} .


echo '    _____   ____  _   _ ______    '
echo '   |  __ \ / __ \| \ | |  ____|   '
echo '   | |  | | |  | | . ` |  __|     '
echo '   | |__| | |__| | |\  | |____    '
echo '   |_____/ \____/|_| \_|______|   '