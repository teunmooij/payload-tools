import type { Access } from 'payload/types';
import { Query, User, Where } from '../types';
import { createQuery } from '../query';

/**
 * Access control function that allows access to anyone
 * @param where optional filter
 * @returns the evaluated filter or `true`
 * @example
 * import { allowAnonymous } from 'payload-rbac';
 *
 * // Full access to anyone
 * const access = allowAnonymous();
 * @example
 * import { allowAnonymous } from 'payload-rbac';
 *
 * // Allow access to published documents for anyone
 * const access = allowAnonymous<Page>({ _status: { equals: 'published' } });
 */
export const allowAnonymous = <TCollection extends object = any, TUser extends User = User>(
  where?: Query<TCollection, TUser>,
): Access<TCollection, TUser> => {
  if (!where) return () => true;
  const query = createQuery(where);
  return args => query._toWhere(args);
};

/**
 * Access control function that filters the output
 * @param where the filter to apply
 * @returns the evaluated filter
 * @example
 * import { filtered } from 'payload-rbac';
 *
 * const access = filtered<Page>({ _status: { equals: 'published' } });
 * @see allowAnonymous
 */
export const filtered: <TCollection extends object = any, TUser extends User = User>(
  where: Query<TCollection, TUser>,
) => Access<TCollection, TUser> = allowAnonymous;

/**
 * Access control function that allows access to anyone, but filters to output to only serve published content
 * @param where optional filter
 * @returns a filter to only serve publish content, combined with the evaluated given filter, if provided
 * @example
 * import { allowPublished } from 'payload-rbac';
 *
 * // Allow access to published documents to anyone
 * const access = allowPublished();
 * @example
 * import { allowPublished } from 'payload-rbac';
 *
 * // Allow access to documents authored by Santa to anyone
 * const access = allowPublished<Page>({ author: { equals: 'Santa' } });
 */
export const allowPublished = <TCollection extends { _status?: 'draft' | 'published' } = any, TUser extends User = User>(
  where?: Query<TCollection, TUser>,
): Access => {
  const publishedFilter: Where<TCollection> = { _status: { equals: 'published' } } as Where;

  if (where) {
    const query = createQuery(where);
    return args => ({ and: [query._toWhere(args), publishedFilter] });
  }

  return () => publishedFilter;
};
