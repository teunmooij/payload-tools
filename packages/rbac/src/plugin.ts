import { Config } from 'payload/config';
import { SelectField } from 'payload/types';
import { Options } from './types';

/**
 * Payload rbac plugin, which adds roles to your auth collection, that can be used in the access functions
 * @param options the options for the plugin
 * @returns the payload-rbac plugin
 * @example
 * import { buildConfig } from 'payload/config';
 * import rbac  from 'payload-rbac';
 *
 * export default buildConfig({
 *   plugins: [
 *     rbac({
 *       collections: ['users'],
 *       roles: ['reader', 'maintainer', 'admin'],
 *       defaultRoles: ['reader'],
 *     }),
 *   ],
 *   // The rest of your config goes here
 * });
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

      const rolesField: SelectField = {
        name: 'roles',
        type: 'select',
        hasMany: true,
        defaultValue: options.defaultRoles,
        options: options.roles,
        saveToJWT: true,
      };

      return {
        ...collection,
        fields: [...(collection.fields || []), rolesField],
      };
    }),
  });
