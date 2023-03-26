import type { OpenAPIV3 } from 'openapi-types';
import { createResponse } from '../schemas/basic-components';

export const confirmationMessage: OpenAPIV3.SchemaObject = {
  title: 'Accepted response message',
  type: 'object',
  additionalProperties: false,
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
};

export default createResponse('accepted response', 'confirmationMessage');
