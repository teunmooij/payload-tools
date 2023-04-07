import { User } from '../../src';

export const createUser = (...roles: string[]): User => ({
  id: '1234',
  email: 'a@b.com',
  collection: 'user',
  roles,
});
