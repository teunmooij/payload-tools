import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';

import type { Options } from '../../../../options';
import { createRef, createResponse } from '../../../../schemas';

import { getAuthPaths } from './auth-paths';

import me from './me';
import { getEmailVerificationPaths } from './email-paths';
import { getUnlockPaths } from './unlock-paths';
import { getPasswordRecoveryPaths } from './recovery-paths';

export const getAuthRoutes = (
  collection: SanitizedCollectionConfig,
  options: Options,
): Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'> => {
  if (!collection.auth || !options.include.authPaths) return { paths: {}, components: {} };

  const schemas: Record<string, OpenAPIV3.SchemaObject> = {
    [`${collection.slug}Me`]: me(collection.slug),
  };
  const responses: Record<string, OpenAPIV3.ResponseObject> = {
    [`${collection.slug}MeResponse`]: createResponse('ok', `${collection.slug}Me`),
  };

  if (options.include.passwordRecovery) {
    schemas[`${collection.slug}PasswordReset`] = {
      type: 'object',
      properties: {
        message: { type: 'string' },
        token: { type: 'string' },
        user: createRef(collection.slug),
      },
      required: ['message', 'token', 'user'],
    };

    responses[`${collection.slug}PasswordResetResponse`] = createResponse('ok', `${collection.slug}PasswordReset`);
  }

  return {
    paths: {
      ...getAuthPaths(collection),
      ...getEmailVerificationPaths(collection),
      ...getUnlockPaths(collection, options),
      ...getPasswordRecoveryPaths(collection, options),
    },
    components: {
      schemas,
      responses,
    },
  };
};
