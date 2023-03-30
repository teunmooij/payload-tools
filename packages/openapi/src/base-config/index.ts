import type { OpenAPIV3 } from 'openapi-types';

import { error } from './error';
import { confirmation } from './confirm';
import where from './where';
import { Options } from '../options';
import { createResponse } from '../schemas';

export * from './parameters';

const schemas: Record<string, OpenAPIV3.SchemaObject> = {
  error,
  confirmation,
  where,
};

const responses: Record<string, OpenAPIV3.ResponseObject> = {
  'InvalidRequestErrorResponse': createResponse('invalid request', 'error'),
  'UnauthorizedErrorResponse': createResponse('unauthorized', 'error'),
  'NotFoundErrorResponse': createResponse('not found', 'error'),
  confirmationResponse: createResponse('confirmed', 'confirmation'),
};

const createBaseConfig = (options: Options): OpenAPIV3.Document => ({
  openapi: '3.0.3',
  info: {
    title: 'Payload CMS',
    version: '1.0.0',
  },
  paths: {},
  components: {
    securitySchemes: {
      basicAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'jwt',
      },
      cookieAuth: {
        in: 'cookie',
        type: 'apiKey',
        name: options.access.cookieName,
      },
      ...(options.access.apiKey
        ? {
            apiKeyAuth: {
              in: 'header',
              type: 'apiKey',
              name: 'Authorization',
            },
          }
        : {}),
    },
    schemas,
    responses,
  },
  externalDocs: {
    description: 'Payload REST API documentation',
    url: 'https://payloadcms.com/docs/rest-api/overview',
  },
});

export default createBaseConfig;
