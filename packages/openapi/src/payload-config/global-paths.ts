import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedGlobalConfig } from 'payload/types';
import { Options } from '../options';
import { basicParameters } from '../base-config';
import { createRequestBody, createResponse, createUpsertConfirmationSchema } from '../schemas';
import { getDescription } from '../utils';
import { getCustomPaths } from './custom-paths';
import { getRouteAccess } from './route-access';

export const getGlobalPaths = async (global: SanitizedGlobalConfig, options: Options): Promise<OpenAPIV3.PathsObject> => {
  const description = getDescription(global);

  return Object.assign(
    {
      [`/globals/${global.slug}`]: {
        get: {
          summary: description,
          description,
          tags: [`global ${global.slug}`],
          security: await getRouteAccess(global, 'read', options.access),
          parameters: basicParameters,
          responses: {
            '200': createResponse('successful operation', global.slug),
          },
        },
        post: {
          summary: `Updates the ${global.slug}`,
          description: `Updates the ${global.slug}`,
          tags: [`global ${global.slug}`],
          security: await getRouteAccess(global, 'update', options.access),
          parameters: basicParameters,
          requestBody: createRequestBody(global.slug),
          responses: {
            '200': createUpsertConfirmationSchema(global.slug),
          },
        },
      },
    },
    getCustomPaths(global, 'global'),
  );
};
