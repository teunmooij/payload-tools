import { SanitizedConfig } from 'payload/config';
import { SanitizedCollectionConfig } from 'payload/types';
import { entityToJSONSchema } from 'payload/utilities';
import type { OpenAPIObject, PathObject, SchemaObject } from 'openapi3-ts';

import { createRequestBody, createResponse, me } from './schemas';

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

const getSecurity = (collection: SanitizedCollectionConfig, operation: keyof SanitizedCollectionConfig['access']) => {
  if (!collection.auth && operation === 'read') return undefined;

  return [{ basicAuth: [] }];
};

const createPaginatedDocumentSchema = (slug: string): SchemaObject => ({
  type: 'object',
  properties: {
    docs: {
      type: 'array',
      items: {
        '$ref': `#/components/schemas/${slug}`,
      },
    },
    totalDocs: { type: 'number' },
    limit: { type: 'number' },
    totalPages: { type: 'number' },
    page: { type: 'number' },
    pagingCounter: { type: 'number' },
    hasPrevPage: { type: 'boolean' },
    hasNextPage: { type: 'boolean' },
    prevPage: { type: 'number' },
    nextPage: { type: 'number' },
  },
  required: ['docs', 'totalDocs', 'limit', 'totalPages', 'page', 'pagingCounter', 'hasPrevPage', 'hasNextPage'],
});

const createUpsertConfirmationSchema = (slug: string): SchemaObject => ({
  type: 'object',
  properties: {
    doc: {
      '$ref': `#/components/schemas/${slug}`,
    },
    message: { type: 'string' },
  },
  required: ['doc', 'message'],
});

export const analyzePayload = (payloadConfig: SanitizedConfig): Partial<OpenAPIObject> => {
  const authPaths = payloadConfig.collections
    .filter(collection => collection.auth)
    .reduce(
      (dict, collection) => {
        dict[`/${collection.slug}/me`] = {
          get: {
            summary: 'Current user data',
            description: 'Data about the current user',
            tags: ['auth'],
            responses: {
              '200': createResponse('successful operation', `${collection.slug}-me`),
            },
          },
        };

        dict[`/${collection.slug}/login`] = {
          post: {
            summary: 'Login',
            description: 'Login',
            tags: ['auth'],
            requestBody: createRequestBody('login'),
            responses: {
              '200': createResponse('successful operation', `${collection.slug}-me`),
              '401': createResponse('unauthorized', 'errorMessage'),
            },
          },
        };

        dict[`/${collection.slug}/logout`] = {
          post: {
            summary: 'Logout',
            description: 'Logout',
            tags: ['auth'],
            responses: {
              '200': createResponse('successful operation', {
                type: 'object',
                properties: { message: { type: 'string' } },
              }),
              '400': createResponse('no user', 'errorMessage'),
            },
          },
        };

        dict[`/${collection.slug}/refresh-token`] = {
          post: {
            summary: 'Refresh JWT',
            description: 'Refresh the JWT token',
            tags: ['auth'],
            responses: {
              '200': createResponse('successful operation', `${collection.slug}-me`),
              '404': createResponse('not found', 'errorMessage'),
            },
          },
        };

        return dict;
      },
      {
        '/access': {
          get: {
            summary: "Current user's resource access",
            description: "Lists the user's access per resource",
            tags: ['auth'],
            security: [{ basicAuth: [] }],
            responses: {
              '200': createResponse('successful operation', 'access'),
            },
          },
        },
      } as PathObject,
    );

  const paths = payloadConfig.collections.reduce((dict, collection) => {
    const description = getDescription(collection);
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

    dict[`/${collection.slug}`] = {
      get: {
        summary: description,
        description,
        tags: [collection.slug],
        produces: ['application/json'],
        security: getSecurity(collection, 'read'),
        parameters: [...findParams],
        responses: {
          '200': createResponse('successful operation', createPaginatedDocumentSchema(collection.slug)),
        },
      },
      post: {
        summary: `Create a new ${collection.slug}`,
        description: `Create a new ${collection.slug}`,
        tags: [collection.slug],
        security: getSecurity(collection, 'create'),
        requestBody: createRequestBody(collection.slug),
        responses: {
          '200': createUpsertConfirmationSchema(collection.slug),
        },
      },
    };
    dict[`/${collection.slug}/{id}`] = {
      get: {
        summary: `Get a single ${collection.slug} by its id`,
        description: `Get a single ${collection.slug} by its id`,
        tags: [collection.slug],
        security: getSecurity(collection, 'read'),
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
        produces: ['application/json'],
        security: getSecurity(collection, 'update'),
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
        produces: ['application/json'],
        security: getSecurity(collection, 'delete'),
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
    };
    return dict;
  }, authPaths);

  const schemas = payloadConfig.collections.reduce((dict, collection) => {
    dict[collection.slug] = entityToJSONSchema(payloadConfig, collection) as SchemaObject;
    if (collection.auth) {
      dict[`${collection.slug}-me`] = me(collection.slug);
    }
    return dict;
  }, {} as Record<string, SchemaObject>);

  return {
    servers: [{ url: payloadConfig.routes.api || '/api' }],
    paths,
    components: {
      schemas,
    },
  };
};
