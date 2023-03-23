import type { OpenAPIV3 } from 'openapi-types';

const me = (slug: string): OpenAPIV3.SchemaObject => ({
  title: 'Me',
  type: 'object',
  additionalProperties: false,
  properties: {
    user: {
      '$ref': `#/components/schemas/${slug}`,
      nullable: true,
    },
    token: {
      type: 'string',
    },
    exp: {
      type: 'number',
    },
  },
  'required': ['user'],
});

export default me;
