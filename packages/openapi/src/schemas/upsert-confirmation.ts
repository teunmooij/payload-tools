import type { OpenAPIV3 } from 'openapi-types';

export const createUpsertConfirmationSchema = (slug: string): OpenAPIV3.SchemaObject => ({
  type: 'object',
  properties: {
    doc: {
      '$ref': `#/components/schemas/${slug}`,
    },
    message: { type: 'string' },
  },
  required: ['doc', 'message'],
});
