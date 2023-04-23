import type { OpenAPIV3 } from 'openapi-types';

export const createPaginatedDocumentSchema = (schemaName: string, title: string): OpenAPIV3.SchemaObject => ({
  type: 'object',
  title,
  properties: {
    docs: {
      type: 'array',
      items: {
        '$ref': `#/components/schemas/${schemaName}`,
      },
    },
    totalDocs: { type: 'number' },
    limit: { type: 'number' },
    totalPages: { type: 'number' },
    page: { type: 'number' },
    pagingCounter: { type: 'number' },
    hasPrevPage: { type: 'boolean' },
    hasNextPage: { type: 'boolean' },
    prevPage: { type: 'number' },
    nextPage: { type: 'number' },
  },
  required: ['docs', 'totalDocs', 'limit', 'totalPages', 'page', 'pagingCounter', 'hasPrevPage', 'hasNextPage'],
});
