import { allowAnonymous, allowPublished, Query } from '../../src';
import { mockRequest } from '../mocks/request-mock';
import { createUser } from '../mocks/user';

describe('allow anonymous tests', () => {
  it('allows access if not logged in', () => {
    const req = mockRequest();
    const result = allowAnonymous()({ req });

    expect(result).toBe(true);
  });

  it('allows access if logged in', () => {
    const user = createUser();
    const req = mockRequest(user);
    const result = allowAnonymous()({ req });

    expect(result).toBe(true);
  });

  it('returns the given filter', () => {
    const where: Query = { foo: { equals: 'bar' } };

    const req = mockRequest();
    const result = allowAnonymous(where)({ req });

    expect(result).toEqual(where);
  });

  it('returns the given active filter', () => {
    const req = mockRequest();
    const args = { req };

    const where: Query<{ foo: string }> = {
      foo: {
        equals: arg => {
          expect(arg).toBe(args);
          return 'baz';
        },
      },
    };

    const result = allowAnonymous(where)(args);

    expect(result).toEqual({ foo: { equals: 'baz' } });
    expect.assertions(2);
  });

  it('allows access to published documents', () => {
    const req = mockRequest();
    const result = allowPublished()({ req });

    expect(result).toEqual({ _status: { equals: 'published' } });
  });

  it('allows access to published documents with additional filter', () => {
    const where: Query = { foo: { equals: 'bar' } };

    const req = mockRequest();
    const result = allowPublished(where)({ req });

    expect(result).toEqual({ and: [{ foo: { equals: 'bar' } }, { _status: { equals: 'published' } }] });
  });

  it('allows access to published documents with additional active filter', () => {
    const req = mockRequest();
    const args = { req };

    const where: Query<{ foo: string }> = {
      foo: {
        equals: arg => {
          expect(arg).toBe(args);
          return 'baz';
        },
      },
    };

    const result = allowPublished(where)(args);

    expect(result).toEqual({ and: [{ foo: { equals: 'baz' } }, { _status: { equals: 'published' } }] });
    expect.assertions(2);
  });
});
