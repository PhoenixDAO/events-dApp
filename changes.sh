#!/bin/bash

cd build
cp -r app/* .
cp -R app/static/* ./static
find ./ -type f -exec sed -i -e 's/events-dapp/app/g' {} \;
