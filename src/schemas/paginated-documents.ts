import { SchemaObject } from 'openapi3-ts';

export const createPaginatedDocumentSchema = (slug: string): SchemaObject => ({
  type: 'object',
  properties: {
    docs: {
      type: 'array',
      items: {
        '$ref': `#/components/schemas/${slug}`,
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
