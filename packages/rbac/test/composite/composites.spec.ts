import { allowPublished, allowAnyUser, allowUserWithRole, requireAll, requireOne } from '../../src';
import { mockRequest } from '../mocks/request-mock';
import { createUser } from '../mocks/user';

describe('it can nest composite access functions', () => {
  const compositeAccess = requireOne(requireAll(allowPublished(), allowAnyUser()), allowUserWithRole('editor'));

  it('does not allow access if not logged in', async () => {
    const req = mockRequest();

    const result = await compositeAccess({ req });

    expect(result).toBe(false);
  });

  it('allows access to published documents to any user', async () => {
    const user = createUser();
    const req = mockRequest(user);

    const result = await compositeAccess({ req });

    expect(result).toEqual({ _status: { equals: 'published' } });
  });

  it('allows unrestricted access to editors', async () => {
    const user = createUser('editor');
    const req = mockRequest(user);

    const result = await compositeAccess({ req });

    expect(result).toBe(true);
  });
});
