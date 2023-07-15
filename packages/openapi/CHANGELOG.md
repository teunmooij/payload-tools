## 1.3.0

- Added detailed documentation of custom endpoints, including summary, description, success and alternative response schemas and query parameters.

## 1.2.1

- Added `unsupported Payload version` schema to be generated if user attempt to create a schema with a Payload version that has known schema generation issues

## 1.2.0

- Support for payload version >= 1.9, including the added named field interfaces

## 1.1.3

- Fixed bug [#62](https://github.com/teunmooij/payload-tools/issues/62): custom route with different method overwrote existing payload route on same path. Now the routes are properly merged.

## 1.1.1

- Improved naming, titles and descriptions of components and paths.
- Allow overriding of schema names by setting `openapi` labels.

## 1.1.0

- Added version endpoints

## 1.0.5

- Skip routes that have [payload-rbac](https://www.npmjs.com/package/payload-rbac) 'blockAll' access

## 1.0.4

- Added support for multilanguage labels and descriptions in collections and globals.

## 1.0.0

- Validated schema with full payload endpoint coverage

## 0.6.0

- Reuse request / response declarations

## 0.5.1

- `where` type

## 0.5.0

- bulk endpoints (if payload version >=1.6.24)

## 0.4.x

- advanced auth endpoints: password reset, unlock, email verification

## 0.3.x

- preferences endpoints

## 0.2.x

- configuration options

## 0.1.x

- Initial version, before it was part op `payload-swagger`
