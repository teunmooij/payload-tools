import { SanitizedConfig } from 'payload/config';
import type { OpenAPIV3 } from 'openapi-types';

import { me } from '../schemas';
import { createAccessPath } from './access-path';
import { getAuthPaths } from './auth-paths';
import { getCollectionPaths } from './collection-paths';
import { getGlobalPaths } from './global-paths';
import { Options } from '../options';
import { entityToJSONSchema, merge } from '../utils';
import { getCustomPaths } from './custom-paths';
import { createPreferencePaths } from './preference-paths';

const isAuthCollection = (collection: any) => !!collection.auth;

export const analyzePayload = async (payloadConfig: SanitizedConfig, options: Options): Promise<Partial<OpenAPIV3.Document>> => {
  const authDefinitions = payloadConfig.collections
    .filter(collection => options.include.authPaths && collection.auth)
    .map(collection => getAuthPaths(collection, options));

  const { paths: preferencePaths, components: preferenceComponents } = createPreferencePaths(options);
  const { paths: accessPath, components: accessComponents } = createAccessPath(options);

  const collectionDefinitions = await Promise.all(
    payloadConfig.collections
      .filter(collection => !collection.auth || options.include.authCollection)
      .map(collection => getCollectionPaths(collection, options)),
  );
  const globalDefinitions = await Promise.all(payloadConfig.globals.map(global => getGlobalPaths(global, options)));

  const { paths: customPaths, components: customComponents } = options.include.custom
    ? getCustomPaths(payloadConfig, 'payload')
    : { paths: {}, components: {} };

  const schemas = [...payloadConfig.globals, ...payloadConfig.collections].reduce((dict, collection) => {
    dict[collection.slug] = entityToJSONSchema(payloadConfig, collection) as OpenAPIV3.SchemaObject;
    if (isAuthCollection(collection)) {
      dict[`${collection.slug}-me`] = me(collection.slug);
    }
    return dict;
  }, {} as Record<string, OpenAPIV3.SchemaObject>);

  const paths = Object.assign(
    {},
    ...authDefinitions.map(({ paths }) => paths),
    preferencePaths,
    accessPath,
    ...globalDefinitions.map(({ paths }) => paths),
    ...collectionDefinitions.map(({ paths }) => paths),
    customPaths,
  );

  const components = merge<OpenAPIV3.ComponentsObject>(
    { schemas },
    ...authDefinitions.map(({ components }) => components),
    preferenceComponents,
    accessComponents,
    ...globalDefinitions.map(({ components }) => components),
    ...collectionDefinitions.map(({ components }) => components),
    customComponents,
  );

  return {
    servers: [{ url: payloadConfig.routes.api || '/api' }],
    paths,
    components,
  };
};
