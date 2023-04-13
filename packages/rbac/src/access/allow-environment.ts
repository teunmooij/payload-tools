import type { Access } from 'payload/types';
import { Query, User } from '../types';
import { createQuery } from '../query';

/**
 * Access control function that allows access if the environment variable (process.env.*) with the given key has the given value
 * @param key the key of the environment variable
 * @param value the value to test against
 * @param where optional filter
 * @returns the evaluated filter or `true` if the environment variable with the given key has the given value, else `false`
 * @example
 * import { allowEnvironmentValues } from 'payload-rbac';
 *
 * // Allow access only if process.env.SERVICE_ENV is equal to 'staging'
 * const access = allowEnvironmentValues('SERVICE_ENV', 'staging');
 * @example
 * import { allowEnvironmentValues } from 'payload-rbac';
 *
 * // Allow access to published documents, but only if process.env.SERVICE_ENV is equal to 'staging'
 * const access = allowEnvironmentValues<Alert>('SERVICE_ENV', 'staging', { _status: { equals: 'published' } });
 */
export const allowEnvironmentValue = <TCollection extends object = any, TUser extends User = User>(
  key: string,
  value: string,
  where?: Query<TCollection, TUser>,
): Access<TCollection, TUser> => {
  const query = where && createQuery(where);
  return args => process.env[key] === value && (!query || query._toWhere(args));
};
