import { Access, User } from '../types';

/**
 * Creates an access control function that blocks all requests
 * @returns Access control function that always returns `false`
 */
export const blockAll = <TData = any, TUser extends User = User>(): Access<TData, TUser> => {
  const access: Access<TData, TUser> = () => false;
  access.metadata = { blockAll: true };

  return access;
};
