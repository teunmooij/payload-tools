[![author](https://img.shields.io/badge/author-Teun%20Mooij-blue)](https://www.linkedin.com/in/teunmooij/)
[![snyk](https://snyk.io/test/github/teunmooij/payload-tools/badge.svg)](https://snyk.io/test/github/teunmooij/payload-tools)
[![downloads](https://img.shields.io/npm/dt/payload-query?color=blue)](https://www.npmjs.com/package/payload-query)
[![npm version](https://badge.fury.io/js/payload-query.svg)](https://www.npmjs.com/package/payload-query)
[![license](https://img.shields.io/npm/l/payload-query?color=blue)](https://img.shields.io/npm/l/payload-query)

# payload-query

Easy to use query utility for your [Payload cms](https://payloadcms.com).

Main features:

- create type safe queries
- predefine queries to be constructed with data passed in later (e.g. request data)
- select output fields on REST and Internal API.

## Installation

With yarn:

```shell
yarn add payload-query
```

With npm:

```shell
npm install payload-query
```

## Usage - Filter

`payload-query` is built on top of [Payload's query system](https://payloadcms.com/docs/queries/overview).

All examples below assume you have a collection that generates a type as follows:

```ts
type User = {
  id: string;
  name: string;
};

type Post = {
  color: 'mint' | 'dark-grey' | 'white';
  author: string | User;
  featured: boolean;
};
```

### Filter type

The `Filter` type is a strongly typed version of Payload's `Where` type and can be directly used everywhere where the `Where` type is used. By providing your collection type as type it will tell you exactly which paths, operators and operands you can use.

```ts
import { Filter } from 'payload-query';

const query: Filter<Post> = {
  color: {
    equals: 'mint',
  },
};
```

As you can see the `query` looks exactly as the ones you're already using, but there's one big difference: this one is fully type-checked. If you change the name of the `color` property, try to compare it to a value that's not part of the union or try an operator that's not supported for string fields, you'll get a typescript error.

### Query type

Sometimes your query is slightly different every time you use it. For instance if you want to only find some documents where the current user is the author. In that cause easch user has a different query. For such situations you can use the `Query` type:

```ts
import { Query } from 'payload-query';

const query: Query<Post, User> = {
  author: {
    equals: user => user.id,
  },
};
```

With the `Query` type instead of providing a value as operand, you can instead provide a function that takes some data, typed by the 2nd type parameter, and returns a value. You can also still use values if you choose, as shown in the example below:

```ts
import { Query } from 'payload-query';

const query: Query<Post, User> = {
  and: [
    {
      color: {
        equals: 'mint',
      },
    },
    {
      author: {
        equals: user => user.id,
      },
    },
  ],
};
```

### Query > Filter

When you have a `Query`, you of course need to turn it into a `Filter` before you can use it in Payload. For this `payload-query` provides a `toFilter` function.

```ts
import { toFilter } from 'payload-query';
import query = '...';

const data = { id: '123', name: 'Mike' };

const filter = toFilter(query, data);
```

or, if you want to reuse your query:

```ts
import { toFilter } from 'payload-query';
import query = '...';

const authorOnly = toFilter(query);

const filter = authorOnly({ id: '123', name: 'Mike' });
```

### Circular objects

If your collection contains circular references, it is impossible to build the full paths to all possible fields. Therefore such collections cannot be used as type parameter to create a query type.
If you run into this issue, there's 2 ways to solve it:

- use `Pick<MyCollection, 'field1'|'field2'>` to only pick the fields you want to use in your query
- use `any` as collection type (but you'll loose type safety).

## Usage - Select

`payload-query` lets you define a selection of fields that you want in your query results, like a `SELECT` clause in a `SQL` statement, or a `projection` in a `MongoDB` query.

### Select type

The select type defines which fields to select and has the following structure:

```ts
type Select<T> = Partial<Record<keyof T, boolean>>;

// To select only color of a post:
const select: Select<Post> = {
  color: true,
  id: false,
};

// Exclude the id field, include everything else
const select2: Select<Post> = { id: false };
```

By default the `id` field is selected and all others are not. To select a field, add it to the selection, with a value of `true`, to omit the id, include it with a value of `false`. Nested fields are not yet supported and are either all selected or not at all.
If the `select` only contains fields with a value of `false`, all fields that are not part of the `select` will be included.

### Select - REST api

When using the rest api, a `select` query parameter can be used to filter to output. To enable this, the `selectPlugin` must be first added to the payload config:

```ts
import { buildConfig } from 'payload/config';
import { selectPlugin } from 'payload-query';

export default buildConfig({
  plugins: [selectPlugin()],
  // The rest of your config goes here
});
```

The select plugin takes an optional `Options` parameter, which lets you define on which collections / globals you want to enable `select`. If omitted, it is enabled on all.

After the plugin is enabled you can use a `select` query parameter in the same way you would with the `where` parameter:

```shell
http://localhost:3000/api/posts?select[color]=true
```

### Select - Internal api

When using the internal api, select can be used as follows:

```ts
import { select } from 'payload-query';

const doc = payload.findByID({ collection: 'posts', id: 123 });
const filtered = select({ color: true }, doc);
```

Or when using the same filter multiple times:

```ts
import { select } from 'payload-query';

const { docs } = payload.find({ collection: 'posts' });
const selectColor = select({ color: true });

const filtered = docs.map(doc => selectColor(doc));
```

## Version history

See [changelog](./CHANGELOG.md)
