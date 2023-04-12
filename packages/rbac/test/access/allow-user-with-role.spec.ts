import { Query, allowUserWithRole } from '../../src';
import { mockRequest } from '../mocks/request-mock';
import { createUser } from '../mocks/user';

describe('allow user with role tests', () => {
  it('does not allow access if not logged in', () => {
    const req = mockRequest();
    const result = allowUserWithRole('admin')({ req });

    expect(result).toBe(false);
  });

  it('allows access to user with required role', () => {
    const user = createUser('admin');
    const req = mockRequest(user);
    const result = allowUserWithRole('admin')({ req });

    expect(result).toBe(true);
  });

  it('does not allow access when user does not have required role', () => {
    const user = createUser('reader');
    const req = mockRequest(user);
    const result = allowUserWithRole('admin')({ req });

    expect(result).toBe(false);
  });

  it('does not return the given filter if not logged in', () => {
    const where: Query = { foo: { equals: 'bar ' } };

    const req = mockRequest();
    const result = allowUserWithRole('admin', where)({ req });

    expect(result).toBe(false);
  });

  it('returns the given filter to user with required role', () => {
    const where: Query = { foo: { equals: 'bar ' } };

    const user = createUser('admin');
    const req = mockRequest(user);
    const result = allowUserWithRole('admin', where)({ req });

    expect(result).toEqual(where);
  });

  it('returns the given active filter to user with required role', () => {
    const user = createUser('admin');
    const req = mockRequest(user);
    const args = { req };

    const where: Query<{ foo: string }> = {
      foo: {
        equals: arg => {
          expect(arg).toBe(args);
          return args.req.user!.id;
        },
      },
    };

    const result = allowUserWithRole('admin', where)(args);

    expect(result).toEqual({ foo: { equals: '1234' } });
    expect.assertions(2);
  });

  it('does not return the given filter when user does not have required role', () => {
    const where: Query = { foo: { equals: 'bar ' } };

    const user = createUser('reader');
    const req = mockRequest(user);
    const result = allowUserWithRole('admin', where)({ req });

    expect(result).toBe(false);
  });
});
