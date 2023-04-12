import { createQuery } from '../src';

describe('query tests', () => {
  type Collection = { foo: string; bar: { baz: string }[] };
  it('creates a simple query', () => {
    const query = createQuery<Collection>({
      foo: { equals: ({ req: { user } }) => user!.id },
      'bar.0.baz': { equals: 'qux' },
    });

    const where = query._toWhere({ req: { user: { id: 'my-id' } } } as any);

    expect(where).toEqual({
      foo: { equals: 'my-id' },
      'bar.0.baz': { equals: 'qux' },
    });
  });

  it('creates a query with and/or', () => {
    const query = createQuery<Collection>({
      'bar.0.baz': { equals: 'qux' },
      or: [{ foo: { equals: 'admin' } }, createQuery({ foo: { equals: ({ req: { user } }) => user!.email } })],
    });

    const where = query._toWhere({ req: { user: { id: 'my-id', email: 'my-name' } } } as any);

    expect(where).toEqual({
      'bar.0.baz': { equals: 'qux' },
      or: [{ foo: { equals: 'admin' } }, { foo: { equals: 'my-name' } }],
    });
  });
});
