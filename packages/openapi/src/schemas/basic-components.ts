import type { OpenAPIV3 } from 'openapi-types';

export const createContent = (
  content: string | OpenAPIV3.SchemaObject,
): {
  [media: string]: OpenAPIV3.MediaTypeObject;
} => ({
  'application/json': {
    schema:
      typeof content === 'string'
        ? {
            '$ref': `#/components/schemas/${content}`,
          }
        : content,
  },
});

export const createRequestBody = (content: string | OpenAPIV3.SchemaObject): OpenAPIV3.RequestBodyObject => ({
  content: createContent(content),
});

export const createResponse = (description: string, content: string | OpenAPIV3.SchemaObject): OpenAPIV3.ResponseObject => ({
  description,
  content: createContent(content),
});
