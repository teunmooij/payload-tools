import type { SchemaObject } from 'openapi3-ts';

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
          'create': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
              'permission': { 'type': 'boolean' },
            },
            'required': ['permission'],
          },
          'read': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
              'permission': { 'type': 'boolean' },
            },
            'required': ['permission'],
          },
          'update': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
              'permission': { 'type': 'boolean' },
            },
            'required': ['permission'],
          },
          'delete': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
              'permission': { 'type': 'boolean' },
            },
            'required': ['permission'],
          },
          'fields': {
            'type': 'object',
            'additionalProperties': {
              'type': 'object',
              'additionalProperties': false,
              'properties': {
                'create': {
                  'type': 'object',
                  'additionalProperties': false,
                  'properties': {
                    'permission': { 'type': 'boolean' },
                  },
                  'required': ['permission'],
                },
                'read': {
                  'type': 'object',
                  'additionalProperties': false,
                  'properties': {
                    'permission': { 'type': 'boolean' },
                  },
                  'required': ['permission'],
                },
                'update': {
                  'type': 'object',
                  'additionalProperties': false,
                  'properties': {
                    'permission': { 'type': 'boolean' },
                  },
                  'required': ['permission'],
                },
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
