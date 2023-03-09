import { SchemaObject } from 'openapi3-ts';

const me: SchemaObject = {
  title: 'Me',
  type: 'object',
  additionalProperties: false,
  properties: {
    user: {
      '$ref': '#/definitions/users',
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
