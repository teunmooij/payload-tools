import { AccessArgs } from 'payload/config';
import { AccessQuery, User, Where } from './types';

const isAccessQuery = <T extends object, TUser extends User>(
  value: AccessQuery<T, TUser> | Where<T>,
): value is AccessQuery<T, TUser> => '_toWhere' in value && typeof value._toWhere === 'function';

export const createQuery = <T extends object, TUser extends User = User>(
  where: Omit<AccessQuery<T, TUser>, '_toWhere'>,
): AccessQuery<T, TUser> => {
  const shallowClone = { ...where } as AccessQuery<T, TUser>;
  shallowClone._toWhere = (args: AccessArgs<T, TUser>) => {
    const where: Where<T> = {};

    Object.entries(shallowClone).forEach(([key, value]) => {
      if (!value) return;

      switch (key) {
        case '_toWhere':
          break;
        case 'and':
        case 'or':
          where[key] = Array.isArray(value) ? value.map(val => (isAccessQuery(val) ? val._toWhere(args) : val)) : undefined;
          break;
        default:
          where[key as keyof Where<T>] = Object.entries(value).reduce((total, [propKey, propValue]) => {
            total[propKey] = typeof propValue === 'function' ? propValue(args) : propValue;
            return total;
          }, {} as any);
      }
    });

    return where;
  };

  return shallowClone;
};
