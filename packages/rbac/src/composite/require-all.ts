import type { Access } from 'payload/types';
import { isFilter, getAccessEvaluationResult } from './helpers';
import { User } from '../types';

/**
 * Access control function that only grants access if ALL the underlying access control functions grant access.
 * If one or more of the access control functions return a query, those queries are combined with and `and` statement.
 * @param funcs the underlying access control functions
 * @returns the combined filter or `true` if access is granted, else `false`
 * @example
 * import { allowPublished, allowAnyUser, requireAll } from 'payload-rbac';
 *
 * // User needs to login to see the published documents (and cannot see draft documents)
 * const requireAll(allowPublished(), allowAnyUser());
 */
export const requireAll =
  <TCollection extends object = any, TUser extends User = User>(
    ...funcs: [Access<TCollection, TUser>, Access<TCollection, TUser>, ...Access<TCollection, TUser>[]]
  ): Access<TCollection, TUser> =>
  async args => {
    const results = await getAccessEvaluationResult(funcs, args);

    if (results.some(result => !result)) return false;

    const filters = results.filter(isFilter);
    return !filters.length || (filters.length === 1 ? filters[0] : { and: filters });
  };
