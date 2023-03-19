import { PathObject } from 'openapi3-ts';
import { SanitizedCollectionConfig } from 'payload/types';
import { basicParameters, findParameters } from '../base-config';
import { createPaginatedDocumentSchema, createRequestBody, createResponse, createUpsertConfirmationSchema } from '../schemas';
import { getDescription } from '../utils';
import { getRouteAccess } from './route-access';

export const getCollectionPaths = async (
  collection: SanitizedCollectionConfig,
  disableAccessAnalysis: boolean,
): Promise<PathObject> => {
  const description = getDescription(collection);

  return {
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
        summary: `Create a new ${collection.slug}`,
        description: `Create a new ${collection.slug}`,
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
        summary: `Get a single ${collection.slug} by its id`,
        description: `Get a single ${collection.slug} by its id`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'read', disableAccessAnalysis),
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: `id of the ${collection.slug}`,
            required: true,
            type: 'string',
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
        summary: `Updates a ${collection.slug}`,
        description: `Updates a ${collection.slug}`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'update', disableAccessAnalysis),
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: `id of the ${collection.slug}`,
            required: true,
            type: 'string',
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
        summary: `Deletes an existing ${collection.slug}`,
        description: `Deletes an existing ${collection.slug}`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'delete', disableAccessAnalysis),
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: `id of the ${collection.slug}`,
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
  };
};
