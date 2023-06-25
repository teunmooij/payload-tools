import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedConfig } from 'payload/config';
import { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';
import { basicParameters, findParameters } from '../../base-config';
import { Options } from '../../options';
import { createPaginatedDocumentSchema, createRef, createResponse, entityToSchema } from '../../schemas';
import { getPlural, getSingular, getSingularSchemaName } from '../../utils';
import { getRouteAccess, isRouteAvailable } from '../route-access';

const getRootPath = (slug: string, payloadConfig: SanitizedConfig) => {
  if (payloadConfig.globals?.find(global => global.slug === slug)) return `/globals/${slug}/versions`;
  return `/${slug}/versions`;
};

const getTags = (slug: string, payloadConfig: SanitizedConfig) =>
  payloadConfig.globals?.find(global => global.slug === slug) ? [`global ${slug}`] : [slug];

export const createVersionRoutes = async (
  config: SanitizedCollectionConfig | SanitizedGlobalConfig,
  options: Options,
  payloadConfig: SanitizedConfig,
): Promise<Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'>> => {
  if (!config.versions || !isRouteAvailable(config, 'readVersions')) return { paths: {}, components: {} };

  const rootPath = getRootPath(config.slug, payloadConfig);
  const tags = getTags(config.slug, payloadConfig);
  const security = await getRouteAccess(config, 'readVersions', options.access);

  // no need to map the fieldDefinitions, because they are already mapped in the main routes
  const { schema } = await entityToSchema(payloadConfig, config);
  const { id, createdAt, updatedAt, ...version } = schema.properties!;

  const versionedSchema: OpenAPIV3.SchemaObject = {
    title: `${schema.title} version`,
    type: 'object',
    additionalProperties: false,
    properties: {
      id,
      parent: id,
      version: {
        type: 'object',
        additionalProperties: false,
        properties: version,
        required: schema.required?.filter(name => !['id', ' createdAt', 'updatedAt'].includes(name)),
      },
      createdAt,
      updatedAt,
    },
    required: ['id', 'parent', 'version', 'createdAt', 'updatedAt'],
  };

  const singular = getSingular(config);
  const plural = getPlural(config);
  const schemaName = getSingularSchemaName(config);

  const paths: OpenAPIV3.PathsObject = {
    [rootPath]: {
      get: {
        summary: `${singular} versions`,
        description: `Find and query paginated versions of ${plural}`,
        tags,
        security,
        parameters: [...basicParameters, ...findParameters],
        responses: {
          '200': createRef(`${schemaName}Versions`, 'responses'),
        },
      },
    },
    [`${rootPath}/{id}`]: {
      get: {
        summary: `Get a single ${singular} version by its id`,
        description: `Get a single ${singular} version by its id`,
        tags,
        security,
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: `id of the ${singular} version`,
            required: true,
            schema: { type: 'string' },
          },
          ...basicParameters,
          ...findParameters,
        ],
        responses: {
          '200': createRef(`${schemaName}Version`, 'responses'),
          '404': createRef('NotFoundError', 'responses'),
        },
      },
      post: {
        summary: `Restore a ${singular} version by its id`,
        description: `Restore a ${singular} version by its id`,
        tags,
        security: await getRouteAccess(config, 'update', options.access),
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: `id of the ${singular} version`,
            required: true,
            schema: { type: 'string' },
          },
          ...basicParameters,
        ],
        responses: {
          '200': createRef(`${schemaName}UpsertConfirmation`, 'responses'),
          '404': createRef('NotFoundError', 'responses'),
        },
      },
    },
  };

  const components: OpenAPIV3.ComponentsObject = {
    schemas: {
      [`${schemaName}Version`]: versionedSchema,
      [`${schemaName}Versions`]: createPaginatedDocumentSchema(`${schemaName}Version`, `${singular} versions`),
    },
    responses: {
      [`${schemaName}VersionResponse`]: createResponse('ok', `${schemaName}Version`),
      [`${schemaName}VersionsResponse`]: createResponse('ok', `${schemaName}Versions`),
    },
  };

  return {
    paths,
    components,
  };
};
