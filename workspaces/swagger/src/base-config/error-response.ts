import type { SchemaObject } from 'openapi3-ts';
import { createResponse } from '../schemas/basic-components';

export const errorMessage: SchemaObject = {
  title: 'Error response message',
  type: 'object',
  additionalProperties: false,
  properties: {
    errors: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          message: {
            type: 'string',
          },
        },
        required: ['message'],
      },
    },
  },
  required: ['errors'],
};

export default createResponse('error response', 'errorMessage');
