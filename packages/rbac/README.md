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

## Version history

See [changelog](./CHANGELOG.md)
