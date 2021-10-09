#!/bin/bash

\cp -r public/images build/images
cd build
cp -r app/* .
\cp -r app/static ./static
find ./ -type f -exec sed -i -e 's/events-dapp/app/g' {} \;
