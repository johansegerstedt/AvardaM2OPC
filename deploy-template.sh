#!/usr/bin/env bash
set -e

latest_tag=$(git tag | tail -1)
current_branch=$(git rev-parse --abbrev-ref HEAD)
release_filename="Digia_AvardaCheckout.tar.gz"

# DEFINE_SCRIPT_DIR([])
# ARG_OPTIONAL_SINGLE([checkout],,[It is tag or branch], [branch])
# ARG_OPTIONAL_SINGLE([checkout_value],, [In case of tag write v1.1.1, in case of branch is a string], [$current_branch])
# ARG_OPTIONAL_SINGLE([m2path],, [Magento2 installation path], [/var/www/html/magento2opc/])
# ARG_OPTIONAL_BOOLEAN([with_cc],, [Should clean the cache])
# ARG_OPTIONAL_BOOLEAN([with_release],, [Should we  build a release])
# ARG_HELP([<Initial deployment script for local deployments :) >])
# ARGBASH_GO
# [ <-- needed because of Argbash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root like sudo ./deploy.sh"
  exit
fi

printf 'Value of --%s: %s\n' 'checkout' "$_arg_checkout"
printf 'Value of --%s: %s\n' 'checkout_value' "$_arg_checkout_value"
printf 'Value of --%s: %s\n' 'm2path' "$_arg_m2path"
printf 'Value of --%s: %s\n' 'with_cc' "$_arg_with_cc"
printf 'Value of --%s: %s\n' 'with_release' "$_arg_with_release"

echo 'Fetching latest commit messages ...'
git fetch --all

echo 'Stashing changes ...'
git stash

if [ "$_arg_checkout" = "branch" ]
then
    echo Checking out the $_arg_checkout_value
    git checkout $_arg_checkout_value
else
    if [ -z {"$_arg_checkout_value"} ]
    then 
        _arg_checkout_value=latest_tag
    fi
    echo Checking out the $_arg_checkout_value
    git checkout tags/$_arg_checkout_value
fi

cd ${script_dir}/view/frontend/app/

echo 'Install latest packages'
yarn

echo 'Building the app ...'
yarn build:app

echo "AVARDA iframe style location ./view/frontend/web/css/avarda.css"

if [ "${_arg_with_release}" = on ]
then
    # delete if exsits
    [ -e ${release_filename} ] && rm -f ${release_filename}

    cd ${script_dir}
    GZIP=-9 # maximum compression
    tar --exclude='.git*' \
    --exclude='./view/frontend/app' \
    --exclude='.DS_Store' \
    --exclude='.idea' \
    -zcvf ${release_filename} .
fi

if [ "${_arg_with_cc}" = on ]
then
    echo 'Clear caches and all magento stuff ...'
    cd ${_arg_m2path}

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
fi

echo '    _____   ____  _   _ ______    '
echo '   |  __ \ / __ \| \ | |  ____|   '
echo '   | |  | | |  | | . ` |  __|     '
echo '   | |__| | |__| | |\  | |____    '
echo '   |_____/ \____/|_| \_|______|   '
# ] <-- needed because of Argbash