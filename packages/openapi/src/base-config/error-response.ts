import type { OpenAPIV3 } from 'openapi-types';
import { createResponse } from '../schemas/basic-components';

export const errorMessage: OpenAPIV3.SchemaObject = {
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
