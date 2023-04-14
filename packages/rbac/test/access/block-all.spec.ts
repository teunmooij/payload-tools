import { blockAll } from '../../src';
import { mockRequest } from '../mocks/request-mock';
import { createUser } from '../mocks/user';

describe('block all tests', () => {
  it('returns false', () => {
    const user = createUser();
    const req = mockRequest(user);
    const result = blockAll()({ req });

    expect(result).toBe(false);
  });

  it('has metadata to indicate it blocks all requests', () => {
    const accessFunctions = blockAll();

    expect(accessFunctions.metadata).toEqual({ blockAll: true });
  });
});
