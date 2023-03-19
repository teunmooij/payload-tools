import type { OpenAPIObject, ResponseObject, SchemaObject } from 'openapi3-ts';
import access from '../base-config/access';
import login from './login';
import error, { errorMessage } from '../base-config/error-response';
import { SanitizedConfig } from 'payload/config';

const schemas: Record<string, SchemaObject> = {
  login,
  access,
  errorMessage,
};

const responses: Record<string, ResponseObject> = {
  error,
};

const createBaseConfig = (payloadConfig: SanitizedConfig): OpenAPIObject => ({
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
        name: `${payloadConfig.cookiePrefix || 'payload'}-token`,
      },
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
