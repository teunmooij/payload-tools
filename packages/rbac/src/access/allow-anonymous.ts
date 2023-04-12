import type { Access } from 'payload/types';
import { Query, User, Where } from '../types';
import { createQuery } from '../query';

export const allowAnonymous = <TCollection extends object = any, TUser extends User = User>(
  where?: Query<TCollection, TUser>,
): Access<TCollection, TUser> => {
  if (!where) return () => true;
  const query = createQuery(where);
  return args => query._toWhere(args);
};

export const filtered: <TCollection extends object = any, TUser extends User = User>(
  where: Query<TCollection, TUser>,
) => Access<TCollection, TUser> = allowAnonymous;

export const allowPublished = <TCollection extends { _status: string } = any, TUser extends User = User>(
  where?: Query<TCollection, TUser>,
): Access => {
  const publishedFilter: Where<TCollection> = { _status: { equals: 'published' } } as Where;

  if (where) {
    const query = createQuery(where);
    return args => ({ and: [query._toWhere(args), publishedFilter] });
  }

  return () => publishedFilter;
};
