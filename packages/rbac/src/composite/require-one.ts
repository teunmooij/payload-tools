import { Access as PayloadAccess } from 'payload/types';
import { isFilter, getAccessEvaluationResult } from './helpers';
import { Access, User } from '../types';

/**
 * Access control function that only grants access if at least one of the underlying access control functions grant access.
 * If all of the matching control functions return a query, those queries are combined with and `or` statement.
 * @param funcs the underlying access control functions
 * @returns the combined filter or `true` if access is granted, else `false`
 * @example
 * import { allowPublished, allowUserWithRole, requireOne } from 'payload-rbac';
 *
 * // Anyone has access to published documents, but only editors can see draft documents
 * const requireOne(allowPublished(), allowUserWithRole('editor'));
 */
export const requireOne =
  <TCollection extends object = any, TUser extends User = User>(
    ...funcs: [PayloadAccess<TCollection, TUser>, PayloadAccess<TCollection, TUser>, ...PayloadAccess<TCollection, TUser>[]]
  ): Access<TCollection, TUser> =>
  async args => {
    const results = await getAccessEvaluationResult(funcs, args);

    const matching = results.filter(result => result);
    if (!matching.length) return false;

    const filters = matching.filter(isFilter);
    if (filters.length < matching.length) return true;
    return filters.length === 1 ? filters[0] : { or: filters };
  };
