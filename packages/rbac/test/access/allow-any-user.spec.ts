import { Query, allowAnyUser } from '../../src';
import { mockRequest } from '../mocks/request-mock';
import { createUser } from '../mocks/user';

describe('allow any user tests', () => {
  it('allows access if logged in', () => {
    const user = createUser();
    const req = mockRequest(user);
    const result = allowAnyUser()({ req });

    expect(result).toBe(true);
  });

  it('returns the given filter if logged in', () => {
    const where: Query = { foo: { equals: 'bar ' } };

    const user = createUser();
    const req = mockRequest(user);
    const result = allowAnyUser(where)({ req });

    expect(result).toEqual(where);
  });

  it('returns the given active filter if logged in', () => {
    const user = createUser();
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

    const result = allowAnyUser(where)(args);

    expect(result).toEqual({ foo: { equals: '1234' } });
    expect.assertions(2);
  });

  it('does not allow access if not logged in', () => {
    const req = mockRequest();
    const result = allowAnyUser()({ req });

    expect(result).toBe(false);
  });

  it('does not return the given filter if not logged in', () => {
    const where: Query = { foo: { equals: 'bar ' } };

    const req = mockRequest();
    const result = allowAnyUser(where)({ req });

    expect(result).toBe(false);
  });
});
