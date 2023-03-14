import { ContentObject, RequestBodyObject, ResponseObject, SchemaObject } from 'openapi3-ts';

export const createContent = (content: string | SchemaObject): ContentObject => ({
  'application/json': {
    schema:
      typeof content === 'string'
        ? {
            '$ref': `#/components/schemas/${content}`,
          }
        : content,
  },
});

export const createRequestBody = (content: string | SchemaObject): RequestBodyObject => ({
  content: createContent(content),
});

export const createResponse = (description: string, content: string | SchemaObject): ResponseObject => ({
  description,
  content: createContent(content),
});
