import type { Access } from 'payload/types';
import { Query, User } from '../types';
import { createQuery } from '../query';

/**
 * Access control function that allows access to any logged in user
 * @param where optional filter
 * @returns the evaluated filter or `true` if the user is logged in, else `false`
 * @example
 * import { allowAnyUser } from 'payload-rbac';
 *
 * // Allow full access to logged in users
 * const access = allowAnyUser();
 * @example
 * import { allowAnyUser } from 'payload-rbac';
 *
 * // Allow logged in users access to documents for which they are the author
 * const access = allowAnyUser<Post>({ author: { equals: ({ req }) => req.user!.id } });
 */
export const allowAnyUser = <TCollection extends object = any, TUser extends User = User>(
  where?: Query<TCollection, TUser>,
): Access<TCollection, TUser> => {
  const query = where && createQuery(where);
  return args => {
    return Boolean(args.req.user) && (!query || query._toWhere(args));
  };
};

/**
 * Alias for 'allowAnyUser'
 * @see allowAnyUser
 */
export const allowUser = allowAnyUser;
