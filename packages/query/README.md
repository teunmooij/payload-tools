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

## Installation

With yarn:

```shell
yarn add payload-query
```

With npm:

```shell
npm install payload-query
```

## Usage

`payload-query` is built on top of [Payload's query system](https://payloadcms.com/docs/queries/overview).

TODO: explain types and how to use

## Circular objects

If your collection contains circular references, it is impossible to build the full paths to all possible fields. Therefore such collections cannot be used as type parameter to create a query type.
If you run into this issue, there's 2 ways to solve it:

- use `Pick<...>` to only pick the fields you want to use in your query
- use `any` as collection type (but you'll loose type safety).

## Version history

See [changelog](./CHANGELOG.md)
