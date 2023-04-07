import type { Where } from 'payload/types';
import { Access, Role, User } from '../types';

export const allowUserWithRole =
  <TUser extends User = User, TData = any>(role: Role<TUser>, where?: Where): Access<TData, TUser> =>
  ({ req: { user } }) => {
    return Boolean(user?.roles.includes(role)) && (!where || where);
  };
