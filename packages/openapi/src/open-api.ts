import fsAsync from 'fs/promises';
import fs from 'fs';
import { InfoObject, LicenseObject, OpenAPIObject } from 'openapi3-ts';
import path from 'path';
import { DeepPartial } from 'ts-essentials';
import { SanitizedConfig } from 'payload/config';
import { analyzePayload } from './payload-config';

import createBaseConfig from './base-config';
import { merge } from './utils';
import { Options } from './types';

interface PackageInfo {
  name?: string;
  description?: string;
  version?: string;
  license?: string;
  openapi?: DeepPartial<OpenAPIObject>;
}

const readJsonFile = async <T = any>(relativePath: string): Promise<Partial<T>> => {
  try {
    const fullPath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath)) return {};

    const data = await fsAsync.readFile(fullPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
};

/**
 * Creates an openapi document for the given payload configuration
 */
export const createDocument = async (payloadConfig: SanitizedConfig, options: Options = {}): Promise<OpenAPIObject> => {
  const { name, version, description, license, openapi = {} } = await readJsonFile<PackageInfo>('package.json');
  const hasLicenseFile = license && fs.existsSync(path.join(process.cwd(), 'LICENSE'));
  const licenseInfo: LicenseObject | undefined = license
    ? {
        name: license,
        url: hasLicenseFile ? '/api-docs/license' : undefined,
      }
    : undefined;

  const openApiInfo = await readJsonFile<DeepPartial<OpenAPIObject>>('.openapi');

  const payloadInfo = await analyzePayload(payloadConfig, options);

  const info: Partial<InfoObject> = {
    title: name,
    version: version,
    description,
    license: licenseInfo,
  };

  return merge<OpenAPIObject>(
    createBaseConfig(payloadConfig),
    { info },
    payloadInfo,
    openapi as OpenAPIObject, // todo: fix DeepPartial indexer issue
    openApiInfo as OpenAPIObject, // todo: fix DeepPartial indexer issue
  );
};
