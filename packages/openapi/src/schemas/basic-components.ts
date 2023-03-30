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

type ComponentType = 'schemas' | 'responses' | 'requestBodies';

const getPostfix = (type: ComponentType) => {
  switch (type) {
    case 'responses':
      return 'Response';
    case 'requestBodies':
      return 'Request';
    default:
      return '';
  }
};

export const createRef = (entity: string, type: ComponentType = 'schemas') => ({
  '$ref': `#/components/${type}/${entity}${getPostfix(type)}`,
});
