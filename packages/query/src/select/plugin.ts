import { Config } from 'payload/config';
import { collectionSelectHook, globalSelectHook } from './hooks';

interface Options {
  collections?: string[];
  globals?: string[];
}

export const selectPlugin =
  (options?: Options) =>
  (config: Config): Config => ({
    ...config,
    collections: config.collections
      ?.filter(({ slug }) => !options?.collections || options.collections.includes(slug))
      .map(collection => ({
        ...collection,
        hooks: {
          ...collection.hooks,
          afterRead: [...(collection.hooks?.afterRead || []), collectionSelectHook],
        },
      })),
    globals: config.globals
      ?.filter(({ slug }) => !options?.globals || options.globals.includes(slug))
      .map(global => ({
        ...global,
        hooks: {
          ...global.hooks,
          afterRead: [...(global.hooks?.afterRead || []), globalSelectHook],
        },
      })),
  });
