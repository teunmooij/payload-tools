import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';
import { basicParameters, findParameters } from '../../../base-config';
import { Options } from '../../../options';
import { createRef, createResponse } from '../../../schemas';
import { getRouteAccess } from '../../route-access';

export const getBulkRoutes = async (
  collection: SanitizedCollectionConfig,
  options: Options,
): Promise<Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'>> => {
  if (!options.supports.bulkOperations) return { paths: {}, components: {} };

  const plural = collection.labels?.plural || collection.slug;

  const paths: OpenAPIV3.PathsObject = {
    [`/${collection.slug}`]: {
      patch: {
        summary: `Update multiple ${plural}`,
        description: `Update all ${plural} matching the where query`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'delete', options.access),
        parameters: [...findParameters.map(param => ({ ...param, required: param.name === 'where' })), ...basicParameters],
        requestBody: createRef(collection.slug, 'requestBodies'),
        responses: {
          '200': createRef(`${collection.slug}Bulk`, 'responses'),
        },
      },
      delete: {
        summary: `Delete multiple ${plural}`,
        description: `Delete all ${plural} matching the where query`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'delete', options.access),
        parameters: [...findParameters.map(param => ({ ...param, required: param.name === 'where' })), ...basicParameters],
        responses: {
          '200': createRef(`${collection.slug}Bulk`, 'responses'),
        },
      },
    },
  };

  return {
    paths,
    components: {
      responses: {
        [`${collection.slug}BulkResponse`]: createResponse('ok', {
          type: 'object',
          properties: {
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
            docs: { type: 'array', items: createRef(collection.slug) },
          },
        }),
      },
    },
  };
};
