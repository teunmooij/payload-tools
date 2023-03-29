import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';
import { createRef } from '../../../../schemas';

export const getAuthPaths = (collection: SanitizedCollectionConfig): OpenAPIV3.PathsObject => ({
  [`/${collection.slug}/me`]: {
    get: {
      summary: 'Current user data',
      description: 'Data about the current user',
      tags: ['auth'],
      responses: {
        '200': createRef(`${collection.slug}Me`, 'responses'),
      },
    },
  },
  [`/${collection.slug}/login`]: {
    post: {
      summary: 'Login',
      description: 'Login',
      tags: ['auth'],
      requestBody: createRef('login', 'requestBodies'),
      responses: {
        '200': createRef(`${collection.slug}Me`, 'responses'),
        '401': createRef('UnauthorizedError', 'responses'),
      },
    },
  },
  [`/${collection.slug}/logout`]: {
    post: {
      summary: 'Logout',
      description: 'Logout',
      tags: ['auth'],
      responses: {
        '200': createRef('confirmation', 'responses'),
        '400': createRef('NoUserError', 'responses'),
      },
    },
  },
  [`/${collection.slug}/refresh-token`]: {
    post: {
      summary: 'Refresh JWT',
      description: 'Refresh the JWT token',
      tags: ['auth'],
      responses: {
        '200': createRef(`${collection.slug}Me`, 'responses'),
        '404': createRef('NotFoundError', 'responses'),
      },
    },
  },
});
