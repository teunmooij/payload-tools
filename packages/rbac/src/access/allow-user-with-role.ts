import { Access, Query, Role, User } from '../types';
import { createQuery } from '../query';

export const allowUserWithRole = <TCollection extends object = any, TUser extends User = User>(
  role: Role<TUser>,
  where?: Query<TCollection, TUser>,
): Access<TCollection, TUser> => {
  const query = where && createQuery(where);
  return args => Boolean(args.req.user?.roles.includes(role)) && (!query || query._toWhere(args));
};
