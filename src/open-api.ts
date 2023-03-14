import fsAsync from 'fs/promises';
import fs from 'fs';
import mergewith from 'lodash.mergewith';
import { InfoObject, LicenseObject, OpenAPIObject } from 'openapi3-ts';
import path from 'path';
import { DeepPartial } from 'ts-essentials';
import { SanitizedConfig } from 'payload/config';
import { analyzePayload } from './payload-config';

import baseConfig from './base-config';

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

const merge = (...args: DeepPartial<OpenAPIObject>[]) =>
  mergewith(baseConfig, ...args, (first: any, second: any) => {
    if (Array.isArray(first)) return first.concat(second);
    return undefined;
  });

export const createDocument = async (payloadConfig: SanitizedConfig): Promise<OpenAPIObject> => {
  const { name, version, description, license, openapi = {} } = await readJsonFile<PackageInfo>('package.json');
  const hasLicenseFile = license && fs.existsSync(path.join(process.cwd(), 'LICENSE'));
  const licenseInfo: LicenseObject | undefined = license
    ? {
        name: license,
        url: hasLicenseFile ? '/api-docs/license' : undefined,
      }
    : undefined;

  const openApiInfo = await readJsonFile<DeepPartial<OpenAPIObject>>('.openapi');

  const payloadInfo = analyzePayload(payloadConfig);

  const info: Partial<InfoObject> = {
    title: name,
    version: version,
    description,
    license: licenseInfo,
  };

  return merge(baseConfig, { info }, payloadInfo, openapi, openApiInfo);
};
