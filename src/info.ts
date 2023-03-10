import { InfoObject, LicenseObject } from 'openapi3-ts';
import fsAsync from 'fs/promises';
import fs from 'fs';
import path from 'path';

const defaultInfo: InfoObject = {
  title: 'Payload CMS',
  version: '1.0.0',
};

export const getInfo = async (): Promise<InfoObject> => {
  try {
    const packageFilePath = path.join(process.cwd(), 'package.json');
    const data = await fsAsync.readFile(packageFilePath, 'utf-8');
    const { name, version, description, license, swagger } = JSON.parse(data);
    const hasLicenseFile = license && fs.existsSync(path.join(process.cwd(), 'LICENSE'));

    const licenseInfo: LicenseObject | undefined = license
      ? {
          name: license,
          url: hasLicenseFile ? '/api-docs/license' : undefined,
        }
      : undefined;

    return {
      title: name || defaultInfo.title,
      version: version || defaultInfo.version,
      description,
      license: licenseInfo,
      ...swagger,
    };
  } catch {
    return defaultInfo;
  }
};
