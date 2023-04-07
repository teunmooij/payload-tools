import type { Access, Where } from 'payload/types';

export const allowAnyUser =
  (where?: Where): Access =>
  ({ req: { user } }) => {
    return Boolean(user) && (!where || where);
  };
