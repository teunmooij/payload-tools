import type { OperationObject, ParameterObject, PathItemObject, PathObject, SchemaObject } from 'openapi3-ts';
import nodePath from 'path';
import { Endpoint, SanitizedConfig } from 'payload/config';
import { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';
import { createResponse } from '../schemas';

type Config = SanitizedConfig | SanitizedCollectionConfig | SanitizedGlobalConfig;
type ConfigType = 'payload' | 'global' | 'collection';
const isPayloadConfig = (config: Config): config is SanitizedConfig => !('slug' in config);

const getBasePath = (config: Config, type: ConfigType) => {
  if (isPayloadConfig(config)) return '';
  if (type === 'global') return `/globals/${config.slug}`;
  return `/${config.slug}`;
};

const getTags = (config: Config, type: ConfigType) => {
  if (isPayloadConfig(config)) return ['custom'];
  if (type === 'global') return [`global ${config.slug}`];
  return [config.slug];
};

const operations: readonly (keyof PathItemObject)[] = ['get', 'head', 'post', 'put', 'patch', 'delete', 'options'] as const;
const isOperation = (method: string): method is keyof PathItemObject => operations.includes(method as keyof PathItemObject);

const setOperation = (pathItem: PathItemObject, operation: OperationObject, methods: Endpoint['method']) => {
  const sanitizedMethod = methods.toLowerCase();

  if (sanitizedMethod === 'all') {
    setOperation(pathItem, operation, 'get');
    setOperation(pathItem, operation, 'head');
    setOperation(pathItem, operation, 'post');
    setOperation(pathItem, operation, 'put');
    setOperation(pathItem, operation, 'patch');
    setOperation(pathItem, operation, 'delete');
    setOperation(pathItem, operation, 'options');
  }

  if (isOperation(sanitizedMethod)) {
    pathItem[sanitizedMethod] = operation;
  }
};

const isRelevant = (endpoint: Omit<Endpoint, 'root'>, configType: ConfigType) => {
  switch (configType) {
    case 'global':
      if (endpoint.path === '/access' && endpoint.method === 'get') return false;
      if (endpoint.path === '/' && ['get', 'post'].includes(endpoint.method)) return false;
      break;
    case 'collection':
      if (endpoint.path === '/unlock' && endpoint.method === 'post') return false;
  }

  return true;
};

const getPath = (basePath: string, relativePath: string): { path: string; parameters?: ParameterObject[] } => {
  const parameters: ParameterObject[] = [];
  const sanitizedPath = relativePath
    .split('/')
    .map(part => {
      const match = part.match(/^(?<param>:)?(?<name>.*)(?<optional>\?)?$/);
      const { param, name, optional } = match!.groups!;
      if (!param) return part;

      parameters.push({
        name,
        in: 'path',
        required: !optional,
        schema: { type: 'string' },
      });
      return `{${name}}`;
    })
    .join('/');

  const path = nodePath.join(basePath, sanitizedPath);
  return { path, parameters };
};

export const getCustomPaths = (config: Config, type: ConfigType): PathObject => {
  if (!config.endpoints?.length) return {};

  const paths: PathObject = {};
  const basePath = getBasePath(config, type);
  const tags = getTags(config, type);

  for (const endpoint of config.endpoints.filter(endpoint => isRelevant(endpoint, type))) {
    const { path, parameters } = getPath(basePath, endpoint.path);
    if (!paths[path]) paths[path] = {};

    // determine summary, description, response
    const responseSchema: SchemaObject | string = {
      type: 'object',
    };

    const operation: OperationObject = {
      summary: 'custom operation',
      description: 'custom operation',
      tags,
      parameters,
      responses: {
        '200': createResponse('succesful operation', responseSchema),
      },
    };

    if ((endpoint as Endpoint).root) {
      operation.servers = [{ url: '' }];
    }

    setOperation(paths[path], operation, endpoint.method);
  }

  return paths;
};
