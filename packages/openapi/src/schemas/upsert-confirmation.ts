import type { OpenAPIV3 } from 'openapi-types';

export const createUpsertConfirmationSchema = (slug: string, singular: string): OpenAPIV3.SchemaObject => ({
  type: 'object',
  title: `${singular} upsert confirmation`,
  properties: {
    doc: {
      '$ref': `#/components/schemas/${slug}`,
    },
    message: { type: 'string' },
  },
  required: ['doc', 'message'],
});
