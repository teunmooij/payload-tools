import type { Where } from 'payload/types';
import { requireAll, allowAnyUser, allowEnvironmentValues } from '../../src';
import { mockRequest } from '../mocks/request-mock';
import { createUser } from '../mocks/user';

describe('require all tests', () => {
  process.env.TEST_VAR = 'foo';

  it('allows access when all access functions match', async () => {
    const environmentAccess = allowEnvironmentValues('TEST_VAR', 'foo');
    const userAccess = allowAnyUser();

    const user = createUser();
    const req = mockRequest(user);

    const result = await requireAll(environmentAccess, userAccess)({ req });

    expect(result).toBe(true);
  });

  it('does not allow access when some of the access functions do not match', async () => {
    const environmentAccess = allowEnvironmentValues('TEST_VAR', 'foo');
    const userAccess = allowAnyUser();

    const req = mockRequest();
    const result = await requireAll(environmentAccess, userAccess)({ req });

    expect(result).toBe(false);
  });

  it('combines the given where clauses', async () => {
    const environmentAccess = allowEnvironmentValues('TEST_VAR', 'foo', { foo: { equals: 'bar' } });
    const userAccess = allowAnyUser({ bar: { equals: 'baz' } });

    const user = createUser();
    const req = mockRequest(user);

    const result = await requireAll(environmentAccess, userAccess)({ req });

    const expected: Where = { and: [{ foo: { equals: 'bar' } }, { bar: { equals: 'baz' } }] };
    expect(result).toEqual(expected);
  });

  it('does not use AND filter if only one function has a where clauses', async () => {
    const environmentAccess = allowEnvironmentValues('TEST_VAR', 'foo', { foo: { equals: 'bar' } });
    const userAccess = allowAnyUser();

    const user = createUser();
    const req = mockRequest(user);

    const result = await requireAll(environmentAccess, userAccess)({ req });

    const expected: Where = { foo: { equals: 'bar' } };
    expect(result).toEqual(expected);
  });
});
