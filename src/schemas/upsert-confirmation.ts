import type { SchemaObject } from 'openapi3-ts';

export const createUpsertConfirmationSchema = (slug: string): SchemaObject => ({
  type: 'object',
  properties: {
    doc: {
      '$ref': `#/components/schemas/${slug}`,
    },
    message: { type: 'string' },
  },
  required: ['doc', 'message'],
});
