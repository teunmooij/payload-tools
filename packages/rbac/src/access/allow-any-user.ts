import type { Access } from 'payload/types';
import { Query, User } from '../types';
import { createQuery } from '../query';

export const allowAnyUser = <TCollection extends object = any, TUser extends User = User>(
  where?: Query<TCollection, TUser>,
): Access<TCollection, TUser> => {
  const query = where && createQuery(where);
  return args => {
    return Boolean(args.req.user) && (!query || query._toWhere(args));
  };
};
