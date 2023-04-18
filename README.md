[![snyk](https://snyk.io/test/github/teunmooij/payload-tools/badge.svg)](https://snyk.io/test/github/teunmooij/payload-tools)

# payload tools and plugins

This repository will contain multiple tools and plugins for [payload cms](https://payloadcms.com):

## [payload-openapi](./packages/openapi/README.md)

[![npm version](https://badge.fury.io/js/payload-openapi.svg)](https://www.npmjs.com/package/payload-openapi)

Openapi tool for payload cms:

- generate openAPI 3 documentation from your Payload config

## [payload-swagger](./packages/swagger/README.md)

[![npm version](https://badge.fury.io/js/payload-swagger.svg)](https://www.npmjs.com/package/payload-swagger)

Swagger plugin for payload cms:

- exposes openapi document generated with `payload-openapi`
- includes a swagger ui
- easy setup as payload plugin

## [create-payload-api-docs](./packages/create-api-docs/README.md)

[![npm version](https://badge.fury.io/js/create-payload-api-docs.svg)](https://www.npmjs.com/package/create-payload-api-docs)

CLI for generating openAPI 3 documentation for your Payload cms

## [payload-rbac](./packages/rbac/README.md)

[![npm version](https://badge.fury.io/js/payload-rbac.svg)](https://www.npmjs.com/package/payload-rbac)

Easy to use Role based access control for your Payload cms:

- plugin to extend your auth collection(s) with a `roles` property
- lots of predefined access control functions
- tools to combine access control functions to support more complex situations
- fully compatible with any custom access control functions you might already have

## [payload-query](./packages/query/README.md)

[![npm version](https://badge.fury.io/js/payload-query.svg)](https://www.npmjs.com/package/payload-query)

Query utility for your [Payload cms](https://payloadcms.com):

- create type safe queries
- predefine queries to be constructed with data passed in later (e.g. request data)
- select output fields on REST and Internal API.
