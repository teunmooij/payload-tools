import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';
import { createRequestBody, createResponse } from '../schemas';

export const getAuthPaths = (collection: SanitizedCollectionConfig): OpenAPIV3.PathsObject => {
  if (!collection.auth) return {};

  return {
    [`/${collection.slug}/me`]: {
      get: {
        summary: 'Current user data',
        description: 'Data about the current user',
        tags: ['auth'],
        responses: {
          '200': createResponse('successful operation', `${collection.slug}-me`),
        },
      },
    },
    [`/${collection.slug}/login`]: {
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
    },
    [`/${collection.slug}/logout`]: {
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
    },
    [`/${collection.slug}/refresh-token`]: {
      post: {
        summary: 'Refresh JWT',
        description: 'Refresh the JWT token',
        tags: ['auth'],
        responses: {
          '200': createResponse('successful operation', `${collection.slug}-me`),
          '404': createResponse('not found', 'errorMessage'),
        },
      },
    },
  };
};
