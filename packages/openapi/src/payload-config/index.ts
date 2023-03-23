import { SanitizedConfig } from 'payload/config';
import type { OpenAPIV3 } from 'openapi-types';

import { me } from '../schemas';
import { createAccessPath } from './access-path';
import { getAuthPaths } from './auth-paths';
import { getCollectionPaths } from './collection-paths';
import { getGlobalPaths } from './global-paths';
import { Options } from '../types';
import { entityToJSONSchema } from '../utils';
import { getCustomPaths } from './custom-paths';

const isAuthCollection = (collection: any) => !!collection.auth;

export const analyzePayload = async (
  payloadConfig: SanitizedConfig,
  { disableAccessAnalysis = false }: Options,
): Promise<Partial<OpenAPIV3.Document>> => {
  const authPaths = payloadConfig.collections.filter(collection => collection.auth).map(collection => getAuthPaths(collection));
  const accessPath = createAccessPath();
  const collectionPaths = await Promise.all(
    payloadConfig.collections.map(collection => {
      const analysisOptOut = Array.isArray(disableAccessAnalysis)
        ? disableAccessAnalysis.includes(collection.slug)
        : disableAccessAnalysis;
      return getCollectionPaths(collection, analysisOptOut);
    }),
  );
  const globalPaths = await Promise.all(
    payloadConfig.globals.map(global => {
      const analysisOptOut = Array.isArray(disableAccessAnalysis)
        ? disableAccessAnalysis.includes(global.slug)
        : disableAccessAnalysis;
      return getGlobalPaths(global, analysisOptOut);
    }),
  );

  const customPaths = getCustomPaths(payloadConfig, 'payload');

  const schemas = [...payloadConfig.globals, ...payloadConfig.collections].reduce((dict, collection) => {
    dict[collection.slug] = entityToJSONSchema(payloadConfig, collection) as OpenAPIV3.SchemaObject;
    if (isAuthCollection(collection)) {
      dict[`${collection.slug}-me`] = me(collection.slug);
    }
    return dict;
  }, {} as Record<string, OpenAPIV3.SchemaObject>);

  return {
    servers: [{ url: payloadConfig.routes.api || '/api' }],
    paths: Object.assign({}, ...authPaths, accessPath, ...globalPaths, ...collectionPaths, customPaths),
    components: {
      schemas,
    },
  };
};
