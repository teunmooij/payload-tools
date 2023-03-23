import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';
import { basicParameters, findParameters } from '../base-config';
import { createPaginatedDocumentSchema, createRequestBody, createResponse, createUpsertConfirmationSchema } from '../schemas';
import { getDescription } from '../utils';
import { getCustomPaths } from './custom-paths';
import { getRouteAccess } from './route-access';

export const getCollectionPaths = async (
  collection: SanitizedCollectionConfig,
  disableAccessAnalysis: boolean,
): Promise<OpenAPIV3.PathsObject> => {
  const description = getDescription(collection);
  const singleItem = collection.labels?.singular || collection.slug;

  return Object.assign(
    {
      [`/${collection.slug}`]: {
        get: {
          summary: description,
          description,
          tags: [collection.slug],
          security: await getRouteAccess(collection, 'read', disableAccessAnalysis),
          parameters: [...basicParameters, ...findParameters],
          responses: {
            '200': createResponse('successful operation', createPaginatedDocumentSchema(collection.slug)),
          },
        },
        post: {
          summary: `Create a new ${singleItem}`,
          description: `Create a new ${singleItem}`,
          tags: [collection.slug],
          security: await getRouteAccess(collection, 'create', disableAccessAnalysis),
          parameters: basicParameters,
          requestBody: createRequestBody(collection.slug),
          responses: {
            '200': createUpsertConfirmationSchema(collection.slug),
          },
        },
      },
      [`/${collection.slug}/{id}`]: {
        get: {
          summary: `Get a single ${singleItem} by its id`,
          description: `Get a single ${singleItem} by its id`,
          tags: [collection.slug],
          security: await getRouteAccess(collection, 'read', disableAccessAnalysis),
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
            '404': createResponse('not found', 'errorMessage'),
          },
        },
        patch: {
          summary: `Updates a ${singleItem}`,
          description: `Updates a ${singleItem}`,
          tags: [collection.slug],
          security: await getRouteAccess(collection, 'update', disableAccessAnalysis),
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
            '200': createUpsertConfirmationSchema(collection.slug),
            '404': createResponse('not found', 'errorMessage'),
          },
        },
        delete: {
          summary: `Deletes an existing ${singleItem}`,
          description: `Deletes an existing ${singleItem}`,
          tags: [collection.slug],
          security: await getRouteAccess(collection, 'delete', disableAccessAnalysis),
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: `id of the ${singleItem}`,
              required: true,
              type: 'string',
            },
            ...basicParameters,
          ],
          responses: {
            '200': createUpsertConfirmationSchema(collection.slug),
            '404': createResponse('not found', 'errorMessage'),
          },
        },
      },
    },
    getCustomPaths(collection, 'collection'),
  );
};
