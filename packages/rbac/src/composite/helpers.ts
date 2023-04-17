import type { Access as PayloadAccess, AccessArgs, Where } from 'payload/types';
import { Access } from '../types';

const isPromise = (value: any): value is Promise<boolean> => typeof value === 'object' && 'then' in value;

export const isFilter = (value: boolean | Where): value is Where => typeof value !== 'boolean';

export const getAccessEvaluationResult = (funcs: PayloadAccess[], args: AccessArgs) => {
  const resultPromises = funcs.map(func => {
    const result = func(args);
    return isPromise(result) ? result : Promise.resolve(result);
  });

  return Promise.all(resultPromises);
};

export const hasMetadata = (access: PayloadAccess | Access): access is Access => 'metadata' in access;
