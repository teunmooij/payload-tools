import type { Access } from 'payload/types';
import { Query, User } from '../types';
import { createQuery } from '../query';

export const allowEnvironmentValue = <TCollection extends object = any, TUser extends User = User>(
  key: string,
  value: string,
  where?: Query<TCollection, TUser>,
): Access<TCollection, TUser> => {
  const query = where && createQuery(where);
  return args => process.env[key] === value && (!query || query._toWhere(args));
};
