import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedConfig } from 'payload/config';
import type { Options } from '../options';
import { createRequestBody, createResponse } from '../schemas';

const login: OpenAPIV3.SchemaObject = {
  title: 'Login request',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
  required: ['email', 'password'],
};

const unlock: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  properties: {
    email: { type: 'string' },
  },
  required: ['email'],
};

const passwordForgotten: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  properties: {
    email: { type: 'string' },
  },
  required: ['email'],
};

const passwordReset: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  properties: {
    token: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['token', 'password'],
};

export const getAuthSchemas = (config: SanitizedConfig, options: Options): OpenAPIV3.ComponentsObject => {
  if (!options.include.authPaths) return {};

  const requestBodies: Record<string, OpenAPIV3.RequestBodyObject> = {
    loginRequest: createRequestBody(login),
  };

  if (config.collections.some(collection => collection.auth.maxLoginAttempts)) {
    requestBodies['unlockRequest'] = createRequestBody(unlock);
  }

  if (options.include.passwordRecovery) {
    requestBodies['passwordForgottenRequest'] = createRequestBody(passwordForgotten);
    requestBodies['passwordResetRequest'] = createRequestBody(passwordReset);
  }

  return {
    requestBodies,
    responses: {
      NoUserErrorResponse: createResponse('no user', 'error'),
      InvalidTokenErrorResponse: createResponse('invalid token', 'error'),
    },
  };
};
