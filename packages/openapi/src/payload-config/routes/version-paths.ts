import type { OpenAPIV3 } from 'openapi-types';
import { SanitizedConfig } from 'payload/config';
import { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';
import { basicParameters, findParameters } from '../../base-config';
import { Options } from '../../options';
import { createPaginatedDocumentSchema, createRef, createResponse, entityToSchema } from '../../schemas';
import { getPlural, getSingular } from '../../utils';
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

  const schema = await entityToSchema(payloadConfig, config);
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

  const paths: OpenAPIV3.PathsObject = {
    [rootPath]: {
      get: {
        summary: `${singular} versions`,
        description: `Find and query paginated versions of ${plural}`,
        tags,
        security,
        parameters: [...basicParameters, ...findParameters],
        responses: {
          '200': createRef(`${config.slug}Versions`, 'responses'),
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
          '200': createRef(`${config.slug}Version`, 'responses'),
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
          '200': createRef(`${config.slug}UpsertConfirmation`, 'responses'),
          '404': createRef('NotFoundError', 'responses'),
        },
      },
    },
  };

  const components: OpenAPIV3.ComponentsObject = {
    schemas: {
      [`${config.slug}Version`]: versionedSchema,
      [`${config.slug}Versions`]: createPaginatedDocumentSchema(`${config.slug}Version`, `${singular} versions`),
    },
    responses: {
      [`${config.slug}VersionResponse`]: createResponse('ok', `${config.slug}Version`),
      [`${config.slug}VersionsResponse`]: createResponse('ok', `${config.slug}Versions`),
    },
  };

  return {
    paths,
    components,
  };
};
