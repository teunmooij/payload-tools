import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedCollectionConfig } from 'payload/types';
import { SanitizedConfig } from 'payload/config';
import { basicParameters, findParameters } from '../../../base-config';
import { Options } from '../../../options';
import {
  createPaginatedDocumentSchema,
  createRef,
  createRequestBody,
  createResponse,
  createUpsertConfirmationSchema,
  entityToSchema,
} from '../../../schemas';
import { getRouteAccess } from '../../route-access';
import { getDescription } from '../../../utils';

export const getMainRoutes = async (
  collection: SanitizedCollectionConfig,
  options: Options,
  payloadConfig: SanitizedConfig,
): Promise<Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'>> => {
  const description = getDescription(collection);
  const singleItem = collection.labels?.singular || collection.slug;

  const paths: OpenAPIV3.PathsObject = {
    [`/${collection.slug}`]: {
      get: {
        summary: description,
        description,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'read', options.access),
        parameters: [...basicParameters, ...findParameters],
        responses: {
          '200': createRef(`${collection.slug}s`, 'responses'),
        },
      },
      post: {
        summary: `Create a new ${singleItem}`,
        description: `Create a new ${singleItem}`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'create', options.access),
        parameters: basicParameters,
        requestBody: createRef(collection.slug, 'requestBodies'),
        responses: {
          '200': createRef(`${collection.slug}UpsertConfirmation`, 'responses'),
        },
      },
    },
    [`/${collection.slug}/{id}`]: {
      get: {
        summary: `Get a single ${singleItem} by its id`,
        description: `Get a single ${singleItem} by its id`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'read', options.access),
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: `id of the ${singleItem}`,
            required: true,
            schema: { type: 'string' },
          },
          ...basicParameters,
          ...findParameters,
        ],
        responses: {
          '200': createRef(collection.slug, 'responses'),
          '404': createRef('NotFoundError', 'responses'),
        },
      },
      patch: {
        summary: `Updates a ${singleItem}`,
        description: `Updates a ${singleItem}`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'update', options.access),
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: `id of the ${singleItem}`,
            required: true,
            schema: { type: 'string' },
          },
          ...basicParameters,
        ],
        requestBody: createRef(collection.slug, 'requestBodies'),
        responses: {
          '200': createRef(`${collection.slug}UpsertConfirmation`, 'responses'),
          '404': createRef('NotFoundError', 'responses'),
        },
      },
      delete: {
        summary: `Deletes an existing ${singleItem}`,
        description: `Deletes an existing ${singleItem}`,
        tags: [collection.slug],
        security: await getRouteAccess(collection, 'delete', options.access),
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: `id of the ${singleItem}`,
            required: true,
            schema: { type: 'string' },
          },
          ...basicParameters,
        ],
        responses: {
          '200': createRef(`${collection.slug}UpsertConfirmation`, 'responses'),
          '404': createRef('NotFoundError', 'responses'),
        },
      },
    },
  };

  const components: OpenAPIV3.ComponentsObject = {
    schemas: {
      [collection.slug]: await entityToSchema(payloadConfig, collection),
      [`${collection.slug}s`]: createPaginatedDocumentSchema(collection.slug),
      [`${collection.slug}UpsertConfirmation`]: createUpsertConfirmationSchema(collection.slug),
    },
    requestBodies: {
      [`${collection.slug}Request`]: createRequestBody(collection.slug),
    },
    responses: {
      [`${collection.slug}Response`]: createResponse('ok', collection.slug),
      [`${collection.slug}sResponse`]: createResponse('ok', `${collection.slug}s`),
      [`${collection.slug}UpsertConfirmationResponse`]: createResponse('ok', `${collection.slug}UpsertConfirmation`),
    },
  };

  return { paths, components };
};
