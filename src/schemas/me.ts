import type { SchemaObject } from 'openapi3-ts';

const me = (slug: string): SchemaObject => ({
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
