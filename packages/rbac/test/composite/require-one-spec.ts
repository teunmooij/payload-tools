import type { Where } from 'payload/types';
import { requireOne, allowAnyUser, allowEnvironmentValues } from '../../src';
import { mockRequest } from '../mocks/request-mock';
import { createUser } from '../mocks/user';

describe('require one tests', () => {
  process.env.TEST_VAR = 'foo';

  it('does not allow access when none functions match', async () => {
    const environmentAccess = allowEnvironmentValues('TEST_VAR', 'bar');
    const userAccess = allowAnyUser();

    const req = mockRequest();

    const result = await requireOne(environmentAccess, userAccess)({ req });

    expect(result).toBe(false);
  });

  it('allows access when some of the access functions match', async () => {
    const environmentAccess = allowEnvironmentValues('TEST_VAR', 'foo');
    const userAccess = allowAnyUser();

    const req = mockRequest();
    const result = await requireOne(environmentAccess, userAccess)({ req });

    expect(result).toBe(true);
  });

  it('combines the given where clauses', async () => {
    const environmentAccess = allowEnvironmentValues('TEST_VAR', 'foo', { foo: { equals: 'bar' } });
    const userAccess = allowAnyUser({ bar: { equals: 'baz' } });

    const user = createUser();
    const req = mockRequest(user);

    const result = await requireOne(environmentAccess, userAccess)({ req });

    const expected: Where = { or: [{ foo: { equals: 'bar' } }, { bar: { equals: 'baz' } }] };
    expect(result).toEqual(expected);
  });

  it('does not nest the filter if only one has a where clause', async () => {
    const environmentAccess = allowEnvironmentValues('TEST_VAR', 'foo', { foo: { equals: 'bar' } });
    const userAccess = allowAnyUser();

    const req = mockRequest();

    const result = await requireOne(environmentAccess, userAccess)({ req });

    const expected: Where = { foo: { equals: 'bar' } };
    expect(result).toEqual(expected);
  });

  it('takes only the matching where clauses', async () => {
    const environmentAccess = allowEnvironmentValues('TEST_VAR', 'bar', { foo: { equals: 'bar' } });
    const userAccess = allowAnyUser({ bar: { equals: 'baz' } });

    const user = createUser();
    const req = mockRequest(user);

    const result = await requireOne(environmentAccess, userAccess)({ req });

    const expected: Where = { bar: { equals: 'baz' } };
    expect(result).toEqual(expected);
  });
});
