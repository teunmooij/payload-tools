import type { Access, Where } from 'payload/types';

export const allowEnvironmentValue =
  (key: string, value: string, where?: Where): Access =>
  () =>
    process.env[key] === value && (!where || where);
