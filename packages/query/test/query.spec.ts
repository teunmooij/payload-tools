import { toFilter, Query } from '../src';

describe('query tests', () => {
  type Collection = { foo: string; bar: { baz: string }[] };
  type Data = { req: { user: { id: string; email: string } } };
  it('creates a simple query', () => {
    const query: Query<Collection, Data> = {
      foo: { equals: ({ req: { user } }) => user.id },
      'bar.0.baz': { equals: 'qux' },
    };

    const where = toFilter(query, { req: { user: { id: 'my-id', email: 'my-name' } } });

    expect(where).toEqual({
      foo: { equals: 'my-id' },
      'bar.0.baz': { equals: 'qux' },
    });
  });

  it('creates a query with and/or', () => {
    const query: Query<Collection, Data> = {
      'bar.0.baz': { equals: 'qux' },
      or: [{ foo: { equals: 'admin' } }, { foo: { equals: ({ req: { user } }) => user.email } }],
    };

    const where = toFilter(query, { req: { user: { id: 'my-id', email: 'my-name' } } } as any);

    expect(where).toEqual({
      'bar.0.baz': { equals: 'qux' },
      or: [{ foo: { equals: 'admin' } }, { foo: { equals: 'my-name' } }],
    });
  });

  it('is curried', () => {
    const query: Query<Collection, Data> = {
      foo: { equals: ({ req: { user } }) => user.id },
      'bar.0.baz': { equals: 'qux' },
    };

    const preDefined = toFilter(query);
    const where = preDefined({ req: { user: { id: 'my-id', email: 'my-name' } } });

    expect(where).toEqual({
      foo: { equals: 'my-id' },
      'bar.0.baz': { equals: 'qux' },
    });
  });
});
