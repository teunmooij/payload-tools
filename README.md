# payload swagger

Swagger plugin for payload cms:

- generate openAPI 3 documentation from your payload config
- includes Swagger UI

Version 0.x releases should be considered `beta`. Semantic version is not guaranteed until we reach version 1.

## Installation

With yarn:

```shell
yarn add payload-swagger
```

With npm:

```shell
npm install payload-swagger
```

## Usage

`payload-swagger` can be used either as server extension, as plugin or just to generate the openapi document.

### As server extension (recommended)

```typescript
import express from 'express';
import payload from 'payload';
import initSwagger from 'payload-swagger';

const app = express();

await payload.init({
  express: app,
  // rest of init options
});

initSwagger(app, payload.config, {
  /* see options section */
});
```

### As plugin

```typescript
import { buildConfig } from 'payload/config';
import path from 'path';
import { swagger } from 'payload-swagger';

export default buildConfig({
  plugins: [
    swagger({
      /* see options section */
    }),
  ],
  // The rest of your config goes here
});
```

### Just create the openapi document

`payload-swagger` creates openapi documents, version 3.0, as javascript object. If you need a yaml file, please use a library like `yaml` to convert it.

```typescript
import { createDocument } from 'payload-swagger';
import payloadConfig from '...';

const openapiDocument = createDocument(payloadConfig, {
  /* see options section */
});
```

### Options

`payload-swagger` has the following options:

```typescript
interface Options {
  /**
   * By default the access functions on all collections in the config are called to determine
   * the access level of the operations.
   * Provide an array of collection slugs to disable this for the given collections,
   * or `true` to disable for all.
   */
  disableAccessAnalysis?: boolean | string[];
}
```

<!-- ## Version history

### v1.0

- Initial version -->
