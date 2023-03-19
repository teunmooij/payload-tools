import { PathObject } from 'openapi3-ts';
import { SanitizedCollectionConfig } from 'payload/types';
import { createPaginatedDocumentSchema, createRequestBody, createResponse, createUpsertConfirmationSchema } from '../schemas';
import { getRouteAccess } from './route-access';

const findParams = [
  {
    name: 'sort',
    in: 'query',
    description: 'sort by field',
    type: 'string',
  },
  {
    name: 'where',
    in: 'query',
    description: 'pass a where query to constrain returned documents (complex type, see documentation)',
  },
  {
    name: 'limit',
    in: 'query',
    description: 'limit the returned documents to a certain number',
    type: 'number',
  },
  {
    name: 'page',
    in: 'query',
    description: 'get a specific page of documents',
    type: 'number',
  },
];

const getDescription = (collection: SanitizedCollectionConfig) => {
  const description = collection.admin?.description;
  if (typeof description === 'string') return description;
  if (typeof description === 'function') {
    try {
      const value = description();
      if (typeof value === 'string') return value;
    } catch {
      // ignore
    }
  }

  return collection.slug;
};
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
        parameters: [...findParams],
        responses: {
          '200': createResponse('successful operation', createPaginatedDocumentSchema(collection.slug)),
        },
      },
      post: {
        summary: `Create a new ${collection.slug}`,
        description: `Create a new ${collection.slug}`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'create', disableAccessAnalysis),
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
          ...findParams,
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
        ],
        responses: {
          '200': createUpsertConfirmationSchema(collection.slug),
          '404': createResponse('not found', 'errorMessage'),
        },
      },
    },
  };
};
