import type { OpenAPIV3 } from 'openapi-types';

export const createUpsertConfirmationSchema = (schemaName: string, singular: string): OpenAPIV3.SchemaObject => ({
  type: 'object',
  title: `${singular} upsert confirmation`,
  properties: {
    doc: {
      '$ref': `#/components/schemas/${schemaName}`,
    },
    message: { type: 'string' },
  },
  required: ['doc', 'message'],
});
