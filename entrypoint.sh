#!/bin/sh

echo "Setting options to prevent cascading errors..."
set -eu

echo "Copying extension files..."
cd /usr/app
cp -R $GITHUB_WORKSPACE/* /cws/extension/

echo "Preparing build directory..."
mkdir "/cws/build/Shut Up"
cp -R /cws/extension/* "/cws/build/Shut Up/"
ls -la "/cws/build/Shut Up/"

echo "Removing dotfiles..."
find "/cws/build/Shut Up/" -name ".*" -exec rm -r {} \; -print

echo "Building extension..."
yarn build

echo "Submitting extension..."
yarn submit
