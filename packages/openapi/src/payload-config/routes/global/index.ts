import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedGlobalConfig } from 'payload/types';
import { SanitizedConfig } from 'payload/config';
import { Options } from '../../../options';
import { basicParameters } from '../../../base-config';
import { createRef, createRequestBody, createResponse, createUpsertConfirmationSchema, entityToSchema } from '../../../schemas';
import { getDescription, getSingular, merge } from '../../../utils';
import { getCustomPaths } from '../custom-paths';
import { getRouteAccess } from '../../route-access';
import { createVersionRoutes } from '../version-paths';

export const getGlobalRoutes = async (
  global: SanitizedGlobalConfig,
  options: Options,
  payloadConfig: SanitizedConfig,
): Promise<Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'>> => {
  const description = getDescription(global);
  const singleItem = getSingular(global);

  const paths: OpenAPIV3.PathsObject = {
    [`/globals/${global.slug}`]: {
      get: {
        summary: description,
        description,
        tags: [`global ${global.slug}`],
        security: await getRouteAccess(global, 'read', options.access),
        parameters: basicParameters,
        responses: {
          '200': createRef(global.slug, 'responses'),
        },
      },
      post: {
        summary: `Updates the ${singleItem}`,
        description: `Updates the ${singleItem}`,
        tags: [`global ${global.slug}`],
        security: await getRouteAccess(global, 'update', options.access),
        parameters: basicParameters,
        requestBody: createRef(global.slug, 'requestBodies'),
        responses: {
          '200': createRef(`${global.slug}UpsertConfirmation`, 'responses'),
        },
      },
    },
  };
  const components: OpenAPIV3.ComponentsObject = {
    schemas: {
      [global.slug]: await entityToSchema(payloadConfig, global),
      [`${global.slug}UpsertConfirmation`]: createUpsertConfirmationSchema(global.slug),
    },
    requestBodies: {
      [`${global.slug}Request`]: createRequestBody(global.slug),
    },
    responses: {
      [`${global.slug}Response`]: createResponse('ok', global.slug),
      [`${global.slug}UpsertConfirmationResponse`]: createResponse('ok', `${global.slug}UpsertConfirmation`),
    },
  };

  const versionRoutes = await createVersionRoutes(global, options, payloadConfig);
  const customRoutes = getCustomPaths(global, 'global');

  return merge({ paths, components }, versionRoutes, customRoutes);
};
