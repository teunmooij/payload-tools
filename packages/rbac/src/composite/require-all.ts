import type { Access } from 'payload/types';
import { isFilter, getAccessEvaluationResult } from './helpers';
import { User } from '../types';

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
