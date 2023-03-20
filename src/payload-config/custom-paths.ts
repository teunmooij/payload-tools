import type { OperationObject, PathItemObject, PathObject, SchemaObject } from 'openapi3-ts';
import path from 'path';
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

export const getCustomPaths = (config: Config, type: ConfigType): PathObject => {
  if (!config.endpoints?.length) return {};

  const paths: PathObject = {};
  const basePath = getBasePath(config, type);
  const tags = getTags(config, type);

  for (const endpoint of config.endpoints) {
    // extract parameteres
    const route = path.join(basePath, endpoint.path);
    if (!paths[route]) paths[route] = {};

    // determine summary, description, response
    const responseSchema: SchemaObject | string = {
      type: 'object',
    };

    const operation: OperationObject = {
      tags,
      description: 'custom operation',
      responses: {
        '200': createResponse('succesful operation', responseSchema),
      },
    };

    if ((endpoint as Endpoint).root) {
      operation.servers = [{ url: '' }];
    }

    setOperation(paths[route], operation, endpoint.method);
  }

  return paths;
};
