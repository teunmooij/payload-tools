import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';
import type { Options } from '../../../../options';
import { createRef } from '../../../../schemas';

export const getPasswordRecoveryPaths = (collection: SanitizedCollectionConfig, options: Options): OpenAPIV3.PathsObject => {
  if (!options.include.passwordRecovery) return {};

  return {
    [`/${collection.slug}/forgot-password`]: {
      post: {
        summary: 'Start password reset',
        description: 'Entry point for password reset workflow. Sends password reset email.',
        tags: ['auth'],
        requestBody: createRef('passwordForgotten', 'requestBodies'),
        responses: {
          '200': createRef('confirmation', 'responses'),
        },
      },
    },
    [`/${collection.slug}/reset-password`]: {
      post: {
        summary: 'Reset password',
        description: 'Reset password',
        tags: ['auth'],
        requestBody: createRef('passwordReset', 'requestBodies'),
        responses: {
          '200': createRef(`${collection.slug}PasswordResetResponse`, 'responses'),
        },
      },
    },
  };
};
