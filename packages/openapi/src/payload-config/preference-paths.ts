import type { OpenAPIV3 } from 'openapi-types';
import { Options } from '../options';
import { createRequestBody, createResponse } from '../schemas';
import { getAuth } from './route-access';

const parameters: OpenAPIV3.ParameterObject[] = [
  {
    name: 'key',
    in: 'path',
    description: 'key of the preference',
    required: true,
    schema: { type: 'string' },
  },
];

const requestContent: OpenAPIV3.SchemaObject = {
  oneOf: [
    {
      type: 'object',
      properties: {
        value: { type: 'string' },
      },
      required: ['value'],
    },
    {
      type: 'object',
    },
  ],
};

const upsertResponseBody: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    doc: {
      type: 'object',
      properties: {
        value: {},
        key: { type: 'string' },
        user: { type: 'string' },
        userCollection: { type: 'string' },
      },
      required: ['value', 'key', 'user', 'userCollection'],
    },
  },
};

const deleteResponseBody: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
};

const responseBody: OpenAPIV3.SchemaObject = {
  oneOf: [
    {
      type: 'object',
      properties: {
        value: {},
        key: { type: 'string' },
        user: { type: 'string' },
        userCollection: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
      required: ['value', 'key', 'user', 'userCollection', 'createdAt', 'updatedAt'],
    },
    {
      type: 'object',
      properties: {
        message: { type: 'string' },
        value: { nullable: true }, // cannot properly model in 3.0 that it's always null
      },
    },
  ],
};

export const createPreferencePaths = (options: Options): Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'> => {
  if (!options.include.preferences) return { paths: {}, components: {} };

  const security = [getAuth(options.access.apiKey)];

  const paths = {
    '/_preferences/{key}': {
      get: {
        summary: 'Get a preference by key',
        description: 'Get a preference by key',
        tags: ['preferences'],
        security,
        parameters,
        responses: {
          '200': createResponse('successful operation', responseBody),
        },
      },
      post: {
        summary: 'Create or update a preference by key',
        description: 'Create or update a preference by key',
        tags: ['preferences'],
        security,
        parameters,
        requestBody: createRequestBody(requestContent),
        responses: {
          '200': createResponse('successful operation', upsertResponseBody),
        },
      },
      delete: {
        summary: 'Delete a preference by key',
        description: 'Delete a preference by key',
        tags: ['preferences'],
        security,
        parameters,
        responses: {
          '200': createResponse('successful operation', deleteResponseBody),
        },
      },
    },
  };

  return { paths, components: {} };
};
