import type { OpenAPIV3 } from 'openapi-types';

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

export default login;
