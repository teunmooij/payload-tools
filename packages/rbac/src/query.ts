import { AccessArgs } from 'payload/config';
import { AccessQuery, Query, User, Where } from './types';

const toWhere = <TCollection extends object, TUser extends User = User>(
  query: Query<TCollection, TUser>,
  args: AccessArgs<TCollection, TUser>,
): Where<TCollection> => {
  const where: Where<TCollection> = {};

  Object.entries(query).forEach(([key, value]) => {
    if (!value) return;

    switch (key) {
      case '_toWhere':
        break;
      case 'and':
      case 'or':
        where[key] = value?.map(val => toWhere(val, args));
        break;
      default:
        where[key as keyof Where<TCollection>] = Object.entries(value).reduce((total, [propKey, propValue]: any) => {
          total[propKey] = typeof propValue === 'function' ? propValue(args) : propValue;
          return total;
        }, {} as any);
    }
  });

  return where;
};

export const createQuery = <TCollection extends object, TUser extends User = User>(
  where: Query<TCollection, TUser>,
): AccessQuery<TCollection, TUser> => {
  const query = { ...where } as AccessQuery<TCollection, TUser>;
  query._toWhere = (args: AccessArgs<TCollection, TUser>) => toWhere(query, args);

  return query;
};
