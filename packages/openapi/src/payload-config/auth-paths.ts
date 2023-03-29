import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';
import { Options } from '../options';
import { createRequestBody, createResponse } from '../schemas';
import { getAuth } from './route-access';

export const getAuthPaths = (
  collection: SanitizedCollectionConfig,
  options: Options,
): Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'> => {
  if (!collection.auth || !options.include.authPaths) return { paths: {}, components: {} };

  const basicPaths: OpenAPIV3.PathsObject = {
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

  const emailVerificationPaths: OpenAPIV3.PathsObject = collection.auth.verify
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
              '200': { '$ref': 'confirm' },
              '400': createResponse('invalid token', 'errorMessage'),
            },
          },
        },
      }
    : {};

  const unlockPaths: OpenAPIV3.PathsObject = collection.auth.maxLoginAttempts
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
              '200': { '$ref': 'confirm' },
            },
          },
        },
      }
    : {};

  const passwordRecoveryPaths: OpenAPIV3.PathsObject = options.include.passwordRecovery
    ? {
        [`/${collection.slug}/forgot-password`]: {
          post: {
            summary: 'Start password reset',
            description: 'Entry point for password reset workflow. Sends password reset email.',
            tags: ['auth'],
            requestBody: createRequestBody({
              type: 'object',
              properties: {
                email: { type: 'string' },
              },
              required: ['email'],
            }),
            responses: {
              '200': { '$ref': 'confirm' },
            },
          },
        },
        [`/${collection.slug}/reset-password`]: {
          post: {
            summary: 'Reset password',
            description: 'Reset password',
            tags: ['auth'],
            requestBody: createRequestBody({
              type: 'object',
              properties: {
                token: { type: 'string' },
                password: { type: 'string' },
              },
              required: ['token', 'password'],
            }),
            responses: {
              '200': createResponse('succesful operation', {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  token: { type: 'string' },
                  user: {
                    $ref: `#/components/schemas/${collection.slug}`,
                  },
                },
                required: ['message', 'token', 'user'],
              }),
            },
          },
        },
      }
    : {};

  return {
    paths: {
      ...basicPaths,
      ...emailVerificationPaths,
      ...unlockPaths,
      ...passwordRecoveryPaths,
    },
    components: {},
  };
};
