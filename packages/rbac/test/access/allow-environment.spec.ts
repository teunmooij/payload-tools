import type { Where } from 'payload/types';
import { allowEnvironmentValues } from '../../src';
import { mockRequest } from '../mocks/request-mock';
import { createUser } from '../mocks/user';

describe('allow environment tests', () => {
  process.env.TEST_VAR = 'foo';

  it('allows access when environment variable matches', () => {
    const req = mockRequest();
    const result = allowEnvironmentValues('TEST_VAR', 'foo')({ req });

    expect(result).toBe(true);
  });

  it('returns the given filter when environment variable matches', () => {
    const where: Where = { foo: { equals: 'bar ' } };

    const req = mockRequest();
    const result = allowEnvironmentValues('TEST_VAR', 'foo', where)({ req });

    expect(result).toBe(where);
  });

  it('does not allow access when environment variable does not match', () => {
    const user = createUser('reader');
    const req = mockRequest(user);
    const result = allowEnvironmentValues('TEST_VAR', 'bar')({ req });

    expect(result).toBe(false);
  });

  it('does not return the given filter when environment variable does not match', () => {
    const where: Where = { foo: { equals: 'bar ' } };

    const user = createUser('reader');
    const req = mockRequest(user);
    const result = allowEnvironmentValues('TEST_VAR', 'bar', where)({ req });

    expect(result).toBe(false);
  });
});
