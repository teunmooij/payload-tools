import { Query, Filter } from './types';

/**
 * Creates a filter from a query
 * @param query the query to create the filter from
 * @returns a function into which data can be passed to create the filter
 */
export function toFilter<TCollection extends object, TData>(
  query: Query<TCollection, TData>,
): (data: TData) => Filter<TCollection>;
/**
 * Creates a filter from a query
 * @param query the query to create the filter from
 * @param data the data to pass into the function operands
 * @returns the filter
 */
export function toFilter<TCollection extends object, TData>(query: Query<TCollection, TData>, data: TData): Filter<TCollection>;
export function toFilter<TCollection extends object, TData>(
  ...args: [Query<TCollection, TData>, TData] | [Query<TCollection, TData>]
) {
  const query = args[0];
  if (args.length === 1) return (data: TData) => toFilter(query, data);

  const data = args[1];
  const where: Filter<TCollection> = {};

  Object.entries(query).forEach(([key, value]) => {
    if (!value) return;

    switch (key) {
      case 'and':
      case 'or':
        where[key] = value?.map(val => toFilter(val, data));
        break;
      default:
        where[key as keyof Filter<TCollection>] = Object.entries(value).reduce((total, [propKey, propValue]: any) => {
          total[propKey] = typeof propValue === 'function' ? propValue(data) : propValue;
          return total;
        }, {} as any);
    }
  });

  return where;
}
