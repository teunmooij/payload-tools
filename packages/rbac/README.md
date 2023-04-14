[![author](https://img.shields.io/badge/author-Teun%20Mooij-blue)](https://www.linkedin.com/in/teunmooij/)
[![snyk](https://snyk.io/test/github/teunmooij/payload-tools/badge.svg)](https://snyk.io/test/github/teunmooij/payload-tools)
[![downloads](https://img.shields.io/npm/dt/payload-rbac?color=blue)](https://www.npmjs.com/package/payload-rbac)
[![npm version](https://badge.fury.io/js/payload-rbac.svg)](https://www.npmjs.com/package/payload-rbac)
[![license](https://img.shields.io/npm/l/payload-rbac?color=blue)](https://img.shields.io/npm/l/payload-rbac)

# payload-rbac

Easy to use Role based access for your [Payload cms](https://payloadcms.com).

Main features:

- plugin to add role system to your users collection(s)
- ready to use access control functions for many different scenario's
- powerful filtering options built on top of Payloads query system

## Installation

With yarn:

```shell
yarn add payload-rbac
```

With npm:

```shell
npm install payload-rbac
```

## Usage

Add the plugin to your payload config to extend your auth collection:

```typescript
import { buildConfig } from 'payload/config';
import rbac from 'payload-rbac';

export default buildConfig({
  plugins: [
    rbac({
      collections: ['users'], // collections to enable rbac on, default: all auth collections
      roles: ['reader', 'maintainer', 'admin'], // roles
    }),
  ],
  // The rest of your config goes here
});
```

## Use the access control functions

All access control functions allow you to control who can access your data and allow you to add an optional filter.
This documentation assumes that you are familiar with the Payload documentation on access control.

### Allow anonymous

Anyone has access

```ts
import { allowAnonymous } from 'payload-rbac';

const unfilteredAccess = allowAnonymous();
const filteredAccess = allowAnonymous<Page>({ _status: { equals: 'published' } });
```

You can also use the `filtered` alias, which might make you code more readable if you're using `allowAnonymous` in combiniation with other access control functions.

```ts
import { filtered } from 'payload-rbac';

const filteredAccess = filtered<Page>({ _status: { equals: 'published' } });
```

### Allow anonymous access to published documents

Any has access to published documents

```ts
import { allowPublished } from 'payload-rbac';

const allPublishedAccess = allowPublished();
const filteredAccess = allowPublished<Page>({ author: { equals: 'Santa' } });
```

### Allow any user

Any logged in user has access

```ts
import { allowAnyUser } from 'payload-rbac';

const unfilteredAccess = allowAnyUser();
const filteredAccess = allowAnyUser<Post>({ author: { equals: ({ req }) => req.user!.id } });
```

### Allow user with a given role

Only users with the given role have access

```ts
import { allowUserWithRole } from 'payload-rbac';

const unfilteredAccess = allowUserWithRole('admin');
const filteredAccess = allowUserWithRole<Media>('reader', { _status: { equals: 'published' } });
```

### Allow access based on environment variable

Only allow access if the node environment variable with the given key has the given value

```ts
import { allowEnvironmentValues } from 'payload-rbac';

const unfilteredAccess = allowEnvironmentValues('SERVICE_ENV', 'staging');
const filteredAccess = allowEnvironmentValues<Alert>('SERVICE_ENV', 'staging', { _status: { equals: 'published' } });
```

### Block all requests

Blocks all requests. If used with [payload-openapi](https://www.npmjs.com/package/payload-openapi) or [payload-swagger](https://www.npmjs.com/package/payload-swagger), endpoints with this access control function are excluded from documentation.

```ts
import { blockAll } from 'payload-rbac';

const access = blockAll();
```

## Filters

All `payload-rbac` access functions accept an optional `where` parameter. If a `where` paremeter is provided it is used as a query if access is granted. See (payload documentation)[https://payloadcms.com/docs/queries/overview] for more information queries.

As filter you can use a payload `Where` query, but you can also use functions as operands, that receive the `AccessArgs` as input.

```ts
import { Access } from 'payload';
import { filtered } from 'payload-rbac';

const access: Access = filtered<Page>({
  or: [
    { _status: { equals: 'published' } }, // normal where
    { author: { equals: ({ req }) => req.user?.id || '#not-an-author#' } }, // active where
  ],
});
```

To get the most out of the typesystem, it is recommended to use the generic type parameter on the access control function to specify the collection you're using it on (`Page` in the example above). When you specify the collection the typesystem will be able to check that all paths are correct and your operands are of the correct type and it will be able to provide you autocomplete suggestions.

## Composite access control functions

The composite access control functions allow you to easily combine access control functions, both the functions of `payload-rbac` as well as your own access control functions.

### Require one

Allows access if at least one of the given control functions grants access. If all of the matching control functions return a query, those queries are combined with and `or` statement.

```ts
import { allowPublished, allowUserWithRole, requireOne } from 'payload-rbac';

// Anyone has access to published documents, but only editors can see draft documents
const requireOne(allowPublished(), allowUserWithRole('editor'));
```

### Require all

Allows access if all of the given control functions grants access. If one or more of the access control functions return a query, those queries are combined with and `and` statement.

```ts
import { allowPublished, allowAnyUser, requireAll } from 'payload-rbac';

// User needs to login to see the published documents (and cannot see draft documents)
const requireAll(allowPublished(), allowAnyUser());
```

### Combine composites

Composites can be nested:

```ts
import { allowPublished, allowAnyUser, allowUserWithRole, requireAll, requireOne } from 'payload-rbac';

const compositeAccess = requireOne(
  requireAll(allowPublished(), allowAnyUser()), // any logged in user can access published documents
  allowUserWithRole('editor'), // editors can access all documents
);
```

## Version history

See [changelog](./CHANGELOG.md)
