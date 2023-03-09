import type { SchemaObject } from 'openapi3-ts';

const me: SchemaObject = {
  title: 'Me',
  type: 'object',
  additionalProperties: false,
  properties: {
    user: {
      '$ref': '#/components/schemas/users',
    },
    token: {
      type: 'string',
    },
    exp: {
      type: 'number',
    },
  },
  'required': ['user', 'token', 'exp'],
};

export default me;
