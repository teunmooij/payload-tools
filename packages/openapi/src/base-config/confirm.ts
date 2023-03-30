import type { OpenAPIV3 } from 'openapi-types';

export const confirmation: OpenAPIV3.SchemaObject = {
  title: 'Confirmation response message',
  type: 'object',
  additionalProperties: false,
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
};
