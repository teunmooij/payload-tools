import type { Where } from 'payload/types';
import { allowAnonymous, allowPublished } from '../../src';
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
    const where: Where = { foo: { equals: 'bar' } };

    const req = mockRequest();
    const result = allowAnonymous(where)({ req });

    expect(result).toBe(where);
  });

  it('allows access to published documents', () => {
    const req = mockRequest();
    const result = allowPublished()({ req });

    expect(result).toEqual({ _status: { equals: 'published' } });
  });

  it('allows access to published documents with additional filter', () => {
    const where: Where = { foo: { equals: 'bar' } };

    const req = mockRequest();
    const result = allowPublished(where)({ req });

    expect(result).toEqual({ and: [{ foo: { equals: 'bar' } }, { _status: { equals: 'published' } }] });
  });
});
