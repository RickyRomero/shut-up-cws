#!/bin/sh
set -eu

cd /usr/app
cp -R $GITHUB_WORKSPACE/* /cws/extension/

yarn build
yarn submit
