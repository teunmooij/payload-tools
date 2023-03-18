import type { OpenAPIObject, ResponseObject, SchemaObject } from 'openapi3-ts';
import access from '../base-config/access';
import login from './login';
import error, { errorMessage } from '../base-config/error-response';

const schemas: Record<string, SchemaObject> = {
  login,
  access,
  errorMessage,
};

const responses: Record<string, ResponseObject> = {
  error,
};

const baseConfig: OpenAPIObject = {
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
    },
    schemas,
    responses,
  },
  externalDocs: {
    description: 'Payload REST API documentation',
    url: 'https://payloadcms.com/docs/rest-api/overview',
  },
};

export default baseConfig;
