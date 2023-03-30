import { SanitizedConfig } from 'payload/config';
import type { OpenAPIV3 } from 'openapi-types';

import { entityToJSONSchema } from '../schemas';
import { createAccessRoute } from './routes/access';
import { getCollectionRoutes } from './routes/collection';
import { getGlobalRoutes } from './routes/global';
import { Options } from '../options';
import { getCustomPaths } from './routes/custom-paths';
import { createPreferencePaths } from './preference-paths';
import { merge } from '../utils';
import { getAuthSchemas } from './auth-schemas';

export const analyzePayload = async (payloadConfig: SanitizedConfig, options: Options): Promise<Partial<OpenAPIV3.Document>> => {
  const { paths: preferencePaths, components: preferenceComponents } = createPreferencePaths(options);
  const { paths: accessPath, components: accessComponents } = createAccessRoute(options);

  const collectionDefinitions = await Promise.all(
    payloadConfig.collections.map(collection => getCollectionRoutes(collection, options, payloadConfig)),
  );
  const globalDefinitions = await Promise.all(
    payloadConfig.globals.map(global => getGlobalRoutes(global, options, payloadConfig)),
  );

  const { paths: customPaths, components: customComponents } = options.include.custom
    ? getCustomPaths(payloadConfig, 'payload')
    : { paths: {}, components: {} };

  const paths = Object.assign(
    {},
    preferencePaths,
    accessPath,
    ...globalDefinitions.map(({ paths }) => paths),
    ...collectionDefinitions.map(({ paths }) => paths),
    customPaths,
  );

  const components = merge<OpenAPIV3.ComponentsObject>(
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
