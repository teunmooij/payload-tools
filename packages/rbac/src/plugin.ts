import { Config } from 'payload/config';
import { SelectField } from 'payload/types';
import { Options } from './types';

/**
 * Payload rbac plugin
 */
export const plugin =
  (options: Options) =>
  (config: Config): Config => ({
    ...config,
    collections: config.collections?.map(collection => {
      if (!collection.auth || (options?.collections && !options.collections.includes(collection.slug))) return collection;
      if (collection.fields?.some(field => 'name' in field && field.name === 'roles')) {
        throw new Error(
          `Unable to enable payload-rbac on collection ${collection.slug}: collection already has a 'roles' field!`,
        );
      }
      return {
        ...collection,
        fields: [
          ...(collection.fields || []),
          {
            name: 'roles',
            type: 'select',
            hasMany: true,
            defaultValue: options.defaultRoles,
            options: options.roles,
          } satisfies SelectField,
        ],
      };
    }),
  });
