import { SanitizedConfig } from 'payload/config';
import type { OpenAPIV3 } from 'openapi-types';

import { entityToJSONSchema } from '../schemas';
import { createAccessRoute } from './routes/access';
import { getCollectionRoutes } from './routes/collection';
import { getGlobalPaths } from './global-paths';
import { Options } from '../options';
import { getCustomPaths } from './custom-paths';
import { createPreferencePaths } from './preference-paths';
import { merge } from '../utils';
import { getAuthSchemas } from './auth-schemas';

export const analyzePayload = async (payloadConfig: SanitizedConfig, options: Options): Promise<Partial<OpenAPIV3.Document>> => {
  const { paths: preferencePaths, components: preferenceComponents } = createPreferencePaths(options);
  const { paths: accessPath, components: accessComponents } = createAccessRoute(options);

  const collectionDefinitions = await Promise.all(
    payloadConfig.collections.map(collection => getCollectionRoutes(collection, options, payloadConfig)),
  );
  const globalDefinitions = await Promise.all(payloadConfig.globals.map(global => getGlobalPaths(global, options)));

  const { paths: customPaths, components: customComponents } = options.include.custom
    ? getCustomPaths(payloadConfig, 'payload')
    : { paths: {}, components: {} };

  const schemas = payloadConfig.globals.reduce((dict, collection) => {
    dict[collection.slug] = entityToJSONSchema(payloadConfig, collection) as OpenAPIV3.SchemaObject;
    return dict;
  }, {} as Record<string, OpenAPIV3.SchemaObject>);

  const paths = Object.assign(
    {},
    preferencePaths,
    accessPath,
    ...globalDefinitions.map(({ paths }) => paths),
    ...collectionDefinitions.map(({ paths }) => paths),
    customPaths,
  );

  const components = merge<OpenAPIV3.ComponentsObject>(
    { schemas },
    getAuthSchemas(payloadConfig, options),
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
