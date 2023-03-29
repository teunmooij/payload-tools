import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';
import { basicParameters, findParameters } from '../../../base-config';
import { Options } from '../../../options';
import {
  createPaginatedDocumentSchema,
  createRef,
  createRequestBody,
  createResponse,
  createUpsertConfirmationSchema,
} from '../../../schemas';
import { getDescription, merge } from '../../../utils';
import { getCustomPaths } from '../../custom-paths';
import { getRouteAccess } from '../../route-access';
import { getAuthRoutes } from './auth';

export const getCollectionRoutes = async (
  collection: SanitizedCollectionConfig,
  options: Options,
): Promise<Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'>> => {
  const description = getDescription(collection);
  const singleItem = collection.labels?.singular || collection.slug;
  const plural = collection.labels?.plural || collection.slug;

  const bulkEndpoints: OpenAPIV3.PathItemObject = options.supports.bulkOperations
    ? {
        patch: {
          summary: `Update multiple ${plural}`,
          description: `Update all ${plural} matching the where query`,
          tags: [collection.slug],
          security: await getRouteAccess(collection, 'delete', options.access),
          parameters: [...findParameters.map(param => ({ ...param, required: param.name === 'where' })), ...basicParameters],
          requestBody: createRequestBody(collection.slug),
          responses: {
            '200': createResponse(' succesful operation', {
              type: 'object',
              properties: {
                message: { type: 'string' },
                errors: { type: 'array', items: { type: 'string' } },
                docs: { type: 'array', items: { '$ref': `#/components/schemas/${collection.slug}` } },
              },
            }),
          },
        },
        delete: {
          summary: `Delete multiple ${plural}`,
          description: `Delete all ${plural} matching the where query`,
          tags: [collection.slug],
          security: await getRouteAccess(collection, 'delete', options.access),
          parameters: [...findParameters.map(param => ({ ...param, required: param.name === 'where' })), ...basicParameters],
          responses: {
            '200': createResponse(' succesful operation', {
              type: 'object',
              properties: {
                message: { type: 'string' },
                errors: { type: 'array', items: { type: 'string' } },
                docs: { type: 'array', items: { '$ref': `#/components/schemas/${collection.slug}` } },
              },
            }),
          },
        },
      }
    : {};

  const defaultPaths: OpenAPIV3.PathsObject = {
    [`/${collection.slug}`]: {
      get: {
        summary: description,
        description,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'read', options.access),
        parameters: [...basicParameters, ...findParameters],
        responses: {
          '200': createResponse('successful operation', createPaginatedDocumentSchema(collection.slug)),
        },
      },
      post: {
        summary: `Create a new ${singleItem}`,
        description: `Create a new ${singleItem}`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'create', options.access),
        parameters: basicParameters,
        requestBody: createRequestBody(collection.slug),
        responses: {
          '200': createResponse('succesful operation', createUpsertConfirmationSchema(collection.slug)),
        },
      },
      ...bulkEndpoints,
    },
    [`/${collection.slug}/{id}`]: {
      get: {
        summary: `Get a single ${singleItem} by its id`,
        description: `Get a single ${singleItem} by its id`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'read', options.access),
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: `id of the ${singleItem}`,
            required: true,
            schema: { type: 'string' },
          },
          ...basicParameters,
          ...findParameters,
        ],
        responses: {
          '200': createResponse('successful operation', collection.slug),
          '404': createRef('NotFoundError', 'responses'),
        },
      },
      patch: {
        summary: `Updates a ${singleItem}`,
        description: `Updates a ${singleItem}`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'update', options.access),
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: `id of the ${singleItem}`,
            required: true,
            schema: { type: 'string' },
          },
          ...basicParameters,
        ],
        requestBody: createRequestBody(collection.slug),
        responses: {
          '200': createResponse('successful operation', createUpsertConfirmationSchema(collection.slug)),
          '404': createRef('NotFoundError', 'responses'),
        },
      },
      delete: {
        summary: `Deletes an existing ${singleItem}`,
        description: `Deletes an existing ${singleItem}`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'delete', options.access),
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: `id of the ${singleItem}`,
            required: true,
            schema: { type: 'string' },
          },
          ...basicParameters,
        ],
        responses: {
          '200': createResponse('successful operation', createUpsertConfirmationSchema(collection.slug)),
          '404': createRef('NotFoundError', 'responses'),
        },
      },
    },
  };

  const { paths: authPaths, components: authComponents } = getAuthRoutes(collection, options);
  const { paths: customPaths, components: customComponents } = getCustomPaths(collection, 'collection');

  return {
    paths: {
      ...defaultPaths,
      ...customPaths,
      ...authPaths,
    },
    components: merge(authComponents, customComponents),
  };
};
