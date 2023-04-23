import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';

import type { Options } from '../../../../options';
import { createRef, createResponse } from '../../../../schemas';

import { getAuthPaths } from './auth-paths';

import me from './me';
import { getEmailVerificationPaths } from './email-paths';
import { getUnlockPaths } from './unlock-paths';
import { getPasswordRecoveryPaths } from './recovery-paths';
import { getSingularSchemaName } from '../../../../utils';

export const getAuthRoutes = (
  collection: SanitizedCollectionConfig,
  options: Options,
): Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'> => {
  if (!collection.auth || !options.include.authPaths) return { paths: {}, components: {} };

  const schemaName = getSingularSchemaName(collection);

  const schemas: Record<string, OpenAPIV3.SchemaObject> = {
    [`${schemaName}Me`]: me(schemaName),
  };
  const responses: Record<string, OpenAPIV3.ResponseObject> = {
    [`${schemaName}MeResponse`]: createResponse('ok', `${schemaName}Me`),
  };

  if (options.include.passwordRecovery) {
    schemas[`${schemaName}PasswordReset`] = {
      type: 'object',
      properties: {
        message: { type: 'string' },
        token: { type: 'string' },
        user: createRef(schemaName),
      },
      required: ['message', 'token', 'user'],
    };

    responses[`${schemaName}PasswordResetResponse`] = createResponse('ok', `${schemaName}PasswordReset`);
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
