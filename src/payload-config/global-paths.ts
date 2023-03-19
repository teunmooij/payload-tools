import { PathObject } from 'openapi3-ts';
import { SanitizedGlobalConfig } from 'payload/types';
import { basicParameters } from '../base-config';
import { createRequestBody, createResponse, createUpsertConfirmationSchema } from '../schemas';
import { getDescription } from '../utils';
import { getRouteAccess } from './route-access';

export const getGlobalPaths = async (global: SanitizedGlobalConfig, disableAccessAnalysis: boolean): Promise<PathObject> => {
  const description = getDescription(global);

  return {
    [`/globals/${global.slug}`]: {
      get: {
        summary: description,
        description,
        tags: [`global ${global.slug}`],
        security: await getRouteAccess(global, 'read', disableAccessAnalysis),
        parameters: basicParameters,
        responses: {
          '200': createResponse('successful operation', global.slug),
        },
      },
      post: {
        summary: `Updates the ${global.slug}`,
        description: `Updates the ${global.slug}`,
        tags: [`global ${global.slug}`],
        security: await getRouteAccess(global, 'update', disableAccessAnalysis),
        parameters: basicParameters,
        requestBody: createRequestBody(global.slug),
        responses: {
          '200': createUpsertConfirmationSchema(global.slug),
        },
      },
    },
  };
};
