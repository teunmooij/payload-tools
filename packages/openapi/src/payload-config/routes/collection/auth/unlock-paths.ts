import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';
import type { Options } from '../../../../options';
import { createRef } from '../../../../schemas';
import { getAuth } from '../../../route-access';

export const getUnlockPaths = (collection: SanitizedCollectionConfig, options: Options): OpenAPIV3.PathsObject => {
  if (!collection.auth.maxLoginAttempts) return {};

  return {
    [`/${collection.slug}/unlock`]: {
      post: {
        summary: 'Unlock account',
        description: 'Unlock account',
        tags: ['auth'],
        security: [getAuth(options.access.apiKey)],
        requestBody: createRef('unlock', 'requestBodies'),
        responses: {
          '200': createRef('confirmation', 'responses'),
        },
      },
    },
  };
};
