import type { Access, Where } from 'payload/types';

export const allowAnonymous =
  (where?: Where): Access =>
  () =>
    !where || where;

export const allowPublished = (where?: Where): Access => {
  const publishedFilter: Where = { _status: { equals: 'published' } };

  if (where) {
    return () => ({ and: [where, publishedFilter] });
  }

  return () => publishedFilter;
};
