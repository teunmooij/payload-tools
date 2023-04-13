import { Access } from 'payload/types';
import { isFilter, getAccessEvaluationResult } from './helpers';
import { User } from '../types';

export const requireOne =
  <TCollection extends object = any, TUser extends User = User>(
    ...funcs: [Access<TCollection, TUser>, Access<TCollection, TUser>, ...Access<TCollection, TUser>[]]
  ): Access<TCollection, TUser> =>
  async args => {
    const results = await getAccessEvaluationResult(funcs, args);

    const matching = results.filter(result => result);
    if (!matching.length) return false;

    const filters = matching.filter(isFilter);
    if (filters.length < matching.length) return true;
    return filters.length === 1 ? filters[0] : { or: filters };
  };
