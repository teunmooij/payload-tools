import { SanitizedConfig } from 'payload/config';
import type { OpenAPIV3 } from 'openapi-types';

import { me } from '../schemas';
import { createAccessPath } from './access-path';
import { getAuthPaths } from './auth-paths';
import { getCollectionPaths } from './collection-paths';
import { getGlobalPaths } from './global-paths';
import { Options } from '../options';
import { entityToJSONSchema } from '../utils';
import { getCustomPaths } from './custom-paths';

const isAuthCollection = (collection: any) => !!collection.auth;

export const analyzePayload = async (payloadConfig: SanitizedConfig, options: Options): Promise<Partial<OpenAPIV3.Document>> => {
  const authPaths = payloadConfig.collections
    .filter(collection => options.include.authPaths && collection.auth)
    .map(collection => getAuthPaths(collection));

  const accessPath = options.include.authPaths ? createAccessPath(options) : {};

  const collectionPaths = await Promise.all(
    payloadConfig.collections
      .filter(collection => !collection.auth || options.include.authCollection)
      .map(collection => getCollectionPaths(collection, options)),
  );
  const globalPaths = await Promise.all(payloadConfig.globals.map(global => getGlobalPaths(global, options)));

  const customPaths = options.include.custom ? getCustomPaths(payloadConfig, 'payload') : {};

  const schemas = [...payloadConfig.globals, ...payloadConfig.collections].reduce((dict, collection) => {
    dict[collection.slug] = entityToJSONSchema(payloadConfig, collection) as OpenAPIV3.SchemaObject;
    if (isAuthCollection(collection)) {
      dict[`${collection.slug}-me`] = me(collection.slug);
    }
    return dict;
  }, {} as Record<string, OpenAPIV3.SchemaObject>);

  const paths = Object.assign({}, ...authPaths, accessPath, ...globalPaths, ...collectionPaths, customPaths);

  return {
    servers: [{ url: payloadConfig.routes.api || '/api' }],
    paths,
    components: {
      schemas,
    },
  };
};
