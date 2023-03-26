import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';
import { Options } from '../options';
import { createRequestBody, createResponse } from '../schemas';
import { getAuth } from './route-access';

export const getAuthPaths = (collection: SanitizedCollectionConfig, options: Options): OpenAPIV3.PathsObject => {
  if (!collection.auth) return {};

  const emailVerification: OpenAPIV3.PathsObject = collection.auth.verify
    ? {
        [`/${collection.slug}/verify/{token}`]: {
          post: {
            summary: 'Verify email',
            description: 'Verify email',
            tags: ['auth'],
            parameters: [
              {
                name: 'token',
                in: 'path',
                description: 'email verification token',
                required: true,
                schema: { type: 'string' },
              },
            ],
            responses: {
              '200': createResponse('successful operation', {
                type: 'object',
                properties: { message: { type: 'string' } },
                required: ['message'],
              }),
              '400': createResponse('invalid token', 'errorMessage'),
            },
          },
        },
      }
    : {};

  const unlock: OpenAPIV3.PathsObject = collection.auth.maxLoginAttempts
    ? {
        [`/${collection.slug}/unlock`]: {
          post: {
            summary: 'Unlock account',
            description: 'Unlock account',
            tags: ['auth'],
            security: [getAuth(options.access.apiKey)],
            requestBody: createRequestBody({
              type: 'object',
              properties: {
                email: { type: 'string' },
              },
              required: ['email'],
            }),
            responses: {
              '200': createResponse('successful operation', {
                type: 'object',
                properties: { message: { type: 'string' } },
                required: ['message'],
              }),
            },
          },
        },
      }
    : {};

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
    ...emailVerification,
    ...unlock,
    // pwd: /{collection-slug}/forgot-password
    // pwd2: /{collection-slug}/reset-password
  };
};
