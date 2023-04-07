[![author](https://img.shields.io/badge/author-Teun%20Mooij-blue)](https://www.linkedin.com/in/teunmooij/)
[![snyk](https://snyk.io/test/github/teunmooij/payload-tools/badge.svg)](https://snyk.io/test/github/teunmooij/payload-tools)
[![downloads](https://img.shields.io/npm/dt/payload-rbac?color=blue)](https://www.npmjs.com/package/payload-rbac)
[![npm version](https://badge.fury.io/js/payload-rbac.svg)](https://www.npmjs.com/package/payload-rbac)
[![license](https://img.shields.io/npm/l/payload-rbac?color=blue)](https://img.shields.io/npm/l/payload-rbac)

# payload-rbac

Easy to use Role based access for your [Payload cms](https://payloadcms.com).

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
import rbac  from 'payload-rbac';

export default buildConfig({
  plugins: [
    rbac({
      collections: ['users'] // collections to enable rbac on, default: all auth collections
      roles: ['reader', 'maintainer', 'admin'] // roles
    }),
  ],
  // The rest of your config goes here
});
```

## Use the access control functions

All access control functions allow you to control who can access your data and allow you to add an optional filter. This documentation assumes that you are familiar with the Payload documentation on access control.

### Allow anonymous

Anyone has access

```ts
import { allowAnonymous } from 'payload-rbac';

const unfilteredAccess = allowAnonymous();
const filteredAccess = allowAnonymous({ _status: { equals: 'published' } });
```

### Allow anonymous access to published documents

Any has access to published documents

```ts
import { allowPublished } from 'payload-rbac';

const allPublishedAccess = allowPublished();
const filteredAccess = allowPublished({ author: { equals: 'Santa' } });
```

### Allow any user

Any logged in user has access

```ts
import { allowAnyUser } from 'payload-rbac';

const unfilteredAccess = allowAnyUser();
const filteredAccess = allowAnyUser({ _status: { equals: 'published' } });
```

### Allow user with a given role

Only users with the given role have access

```ts
import { allowUserWithRole } from 'payload-rbac';

const unfilteredAccess = allowUserWithRole('admin');
const filteredAccess = allowUserWithRole('reader', { _status: { equals: 'published' } });
```

### Allow access based on environment variable

Only allow access if the node environment variable with the given key has the given value

```ts
import { allowEnvironmentValues } from 'payload-rbac';

const unfilteredAccess = allowEnvironmentValues('ENV', 'staging');
const filteredAccess = allowEnvironmentValues('ENV', 'staging', { _status: { equals: 'published' } });
```

## Composite access control functions

The composite access control functions allow you to easily combine access control functions, both the functions of `payload-rbac` as well as your own access control functions.

### Require one

Allows access if at least one of the given control functions grants access. If one or more of the matching control functions return a query, those queries are combined with and `or` statement.

```ts
import { allowPublished, allowUserWithRole, requireOne } from 'payload-rbac';

// Anyone has access to published documents, but only editors can see draft documents
const requireOne(allowPublished(), allowUserWithRole('editor'));
```

### Require all

Allows access if all of the given control functions grants access. If one or more of the control functions return a query, those queries are combined with and `and` statement.

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
