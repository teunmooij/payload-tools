import type { OpenAPIV3 } from 'openapi-types';

const permission: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  properties: {
    permission: { type: 'boolean' },
  },
  required: ['permission'],
};

const access: OpenAPIV3.SchemaObject = {
  title: 'Access',
  type: 'object',
  additionalProperties: false,
  properties: {
    canAccessAdmin: {
      type: 'boolean',
    },
    collections: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: false,
        properties: {
          create: permission,
          read: permission,
          update: permission,
          delete: permission,
          fields: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              additionalProperties: false,
              properties: {
                create: permission,
                read: permission,
                update: permission,
              },
              required: ['create', 'read', 'update'],
            },
          },
        },
        required: ['create', 'read', 'update', 'delete', 'fields'],
      },
    },
  },
  required: ['canAccessAdmin', 'collections'],
};

export default access;
