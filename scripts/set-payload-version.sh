#!/usr/bin/env bash

 args=($1)
echo ${args[1]}

# args=($1)
VERSION=$1

if [ $# -gt 1 ]; then
  if [ $2 == "true" ]; then
    FLAGS="--save-exact"
  fi
fi

echo "Setting payload version to $VERSION $FLAGS"

npm i -D -w packages/openapi payload@$VERSION
npm i -D -w packages/query payload@$VERSION
npm i -D -w packages/rbac payload@$VERSION
npm i -D -w packages/swagger payload@$VERSION

npm i -w packages/testbed payload@$VERSION

npm list payload
