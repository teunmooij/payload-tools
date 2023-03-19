import { SanitizedConfig } from 'payload/config';
import { entityToJSONSchema } from '../utils/entity-to-json-schema';
import type { OpenAPIObject, SchemaObject } from 'openapi3-ts';

import { me } from '../schemas';
import { createAccessPath } from './access-path';
import { getAuthPaths } from './auth-paths';
import { getCollectionPaths } from './collection-paths';
import { Options } from '../types';

export const analyzePayload = async (
  payloadConfig: SanitizedConfig,
  { disableAccessAnalysis = false }: Options,
): Promise<Partial<OpenAPIObject>> => {
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

  const schemas = payloadConfig.collections.reduce((dict, collection) => {
    dict[collection.slug] = entityToJSONSchema(payloadConfig, collection) as SchemaObject;
    if (collection.auth) {
      dict[`${collection.slug}-me`] = me(collection.slug);
    }
    return dict;
  }, {} as Record<string, SchemaObject>);

  return {
    servers: [{ url: payloadConfig.routes.api || '/api' }],
    paths: Object.assign({}, ...authPaths, accessPath, ...collectionPaths),
    components: {
      schemas,
    },
  };
};
