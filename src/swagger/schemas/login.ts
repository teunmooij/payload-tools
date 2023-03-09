import { SchemaObject } from 'openapi3-ts';

const login: SchemaObject = {
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
