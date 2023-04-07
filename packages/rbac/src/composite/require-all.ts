import type { Access } from 'payload/types';
import { isFilter, getAccessEvaluationResult } from './helpers';

export const requireAll =
  (...funcs: [Access, Access, ...Access[]]): Access =>
  async args => {
    const results = await getAccessEvaluationResult(funcs, args);

    if (results.some(result => !result)) return false;

    const filters = results.filter(isFilter);
    return !filters.length || (filters.length === 1 ? filters[0] : { and: filters });
  };
