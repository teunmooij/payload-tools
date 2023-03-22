import type { SchemaObject } from 'openapi3-ts';

const permission: SchemaObject = {
  type: 'object',
  additionalProperties: false,
  properties: {
    permission: { type: 'boolean' },
  },
  required: ['permission'],
};

const access: SchemaObject = {
  'title': 'Access',
  'type': 'object',
  'additionalProperties': false,
  'properties': {
    'canAccessAdmin': {
      'type': 'boolean',
    },
    'collections': {
      'type': 'object',
      'additionalProperties': {
        'type': 'object',
        'additionalProperties': false,
        'properties': {
          'create': permission,
          'read': permission,
          'update': permission,
          'delete': permission,
          'fields': {
            'type': 'object',
            'additionalProperties': {
              'type': 'object',
              'additionalProperties': false,
              'properties': {
                'create': permission,
                'read': permission,
                'update': permission,
              },
              'required': ['create', 'read', 'update'],
            },
          },
        },
        'required': ['create', 'read', 'update', 'delete', 'fields'],
      },
    },
  },
  'required': ['canAccessAdmin', 'collections'],
};

export default access;
