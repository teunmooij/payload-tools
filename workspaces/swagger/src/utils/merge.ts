import mergewith from 'lodash.mergewith';
import { DeepPartial, NonEmptyArray } from './types';

export const merge = <T extends object>(...args: NonEmptyArray<DeepPartial<T>>): T =>
  mergewith(...args, (first: any, second: any) => {
    if (Array.isArray(first)) return first.concat(second);
    return undefined;
  });
