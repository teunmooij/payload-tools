import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';
import { basicParameters, findParameters } from '../../../base-config';
import { Options } from '../../../options';
import { createRef, createResponse } from '../../../schemas';
import { getPlural, getSingularSchemaName } from '../../../utils';
import { getRouteAccess, includeIfAvailable } from '../../route-access';

export const getBulkRoutes = async (
  collection: SanitizedCollectionConfig,
  options: Options,
): Promise<Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'>> => {
  if (!options.supports.bulkOperations) return { paths: {}, components: {} };

  const plural = getPlural(collection);
  const schemaName = getSingularSchemaName(collection);

  const paths: OpenAPIV3.PathsObject = {
    [`/${collection.slug}`]: {
      ...includeIfAvailable(collection, 'update', {
        patch: {
          summary: `Update multiple ${plural}`,
          description: `Update all ${plural} matching the where query`,
          tags: [collection.slug],
          security: await getRouteAccess(collection, 'update', options.access),
          parameters: [...findParameters.map(param => ({ ...param, required: param.name === 'where' })), ...basicParameters],
          requestBody: createRef(schemaName, 'requestBodies'),
          responses: {
            '200': createRef(`${schemaName}Bulk`, 'responses'),
          },
        },
      }),
      ...includeIfAvailable(collection, 'delete', {
        delete: {
          summary: `Delete multiple ${plural}`,
          description: `Delete all ${plural} matching the where query`,
          tags: [collection.slug],
          security: await getRouteAccess(collection, 'delete', options.access),
          parameters: [...findParameters.map(param => ({ ...param, required: param.name === 'where' })), ...basicParameters],
          responses: {
            '200': createRef(`${schemaName}Bulk`, 'responses'),
          },
        },
      }),
    },
  };

  return {
    paths,
    components: includeIfAvailable(collection, ['delete', 'update'], {
      responses: {
        [`${schemaName}BulkResponse`]: createResponse('ok', {
          type: 'object',
          properties: {
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
            docs: { type: 'array', items: createRef(schemaName) },
          },
        }),
      },
    }),
  };
};
