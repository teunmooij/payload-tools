import { Access } from 'payload/types';
import { isFilter, getAccessEvaluationResult } from './helpers';

export const requireOne =
  (...funcs: [Access, Access, ...Access[]]): Access =>
  async args => {
    const results = await getAccessEvaluationResult(funcs, args);

    const matching = results.filter(result => result);
    if (!matching.length) return false;

    const filters = matching.filter(isFilter);
    if (filters.length < matching.length) return true;
    return filters.length === 1 ? filters[0] : { or: filters };
  };
