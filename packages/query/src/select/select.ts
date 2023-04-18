import { objectEntries, objectValues } from 'ts-powertools';
import { Select } from './types';

type TypeWithID = {
  id: string | number;
};

const toBoolean = (value: any) =>
  typeof value === 'boolean' ? value : typeof value === 'string' && !['0', 'false'].includes(value?.toLowerCase() || '0');

export const selectInternal = <T extends TypeWithID>(fields: Partial<Record<keyof T, any>>, doc: T): Partial<T> => {
  const omitOnly = objectValues(fields).every(field => !field);

  return objectEntries(fields).reduce(
    (result, [key, value]) => {
      if (toBoolean(value)) {
        result[key] = doc[key];
      } else {
        delete result[key];
      }

      return result;
    },
    omitOnly ? { ...doc } : ({ id: doc.id } as Partial<T>),
  );
};

export function select<T extends TypeWithID>(fields: Select<T>, document: T): Partial<T>;
export function select<T extends TypeWithID>(fields: Select<T>): (document: T) => Partial<T>;
export function select<T extends TypeWithID>(...args: [Select<T>] | [Select<T>, T]) {
  const fields = args[0];
  if (args.length === 1) return (document: T) => select(fields, document);
  const doc = args[1];

  return selectInternal(fields, doc);
}
