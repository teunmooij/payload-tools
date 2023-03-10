import { InfoObject } from 'openapi3-ts';
import fs from 'fs/promises';
import path from 'path';

const defaultInfo: InfoObject = {
  title: 'Payload CMS',
  version: '1.0.0',
};

export const getInfo = async (): Promise<InfoObject> => {
  try {
    const packageFilePath = path.join(process.cwd(), 'package.json');
    const data = await fs.readFile(packageFilePath, 'utf-8');
    const { name, version, description } = JSON.parse(data);
    return {
      title: name || defaultInfo.title,
      version: version || defaultInfo.version,
      description,
    };
  } catch {
    return defaultInfo;
  }
};
