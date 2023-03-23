import fsAsync from 'fs/promises';
import fs from 'fs';
import type { OpenAPIV3 } from 'openapi-types';
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
  openapi?: DeepPartial<OpenAPIV3.Document>;
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
export const createDocument = async (payloadConfig: SanitizedConfig, options: Options = {}): Promise<OpenAPIV3.Document> => {
  const { name, version, description, license, openapi = {} } = await readJsonFile<PackageInfo>('package.json');
  const hasLicenseFile = license && fs.existsSync(path.join(process.cwd(), 'LICENSE'));
  const licenseInfo: OpenAPIV3.LicenseObject | undefined = license
    ? {
        name: license,
        url: hasLicenseFile ? '/api-docs/license' : undefined,
      }
    : undefined;

  const openApiInfo = await readJsonFile<DeepPartial<OpenAPIV3.Document>>('.openapi');

  const payloadInfo = await analyzePayload(payloadConfig, options);

  const info: Partial<OpenAPIV3.InfoObject> = {
    title: name,
    version: version,
    description,
    license: licenseInfo,
  };

  return merge<OpenAPIV3.Document>(
    createBaseConfig(payloadConfig),
    { info },
    payloadInfo,
    openapi as OpenAPIV3.Document, // todo: fix DeepPartial indexer issue
    openApiInfo as OpenAPIV3.Document, // todo: fix DeepPartial indexer issue
  );
};
