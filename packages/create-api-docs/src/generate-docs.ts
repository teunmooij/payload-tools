import fs from 'fs/promises';
import path from 'path';

import { createDocument, Options } from 'payload-openapi';
import loadConfig from 'payload/dist/config/load';

export default async (configPath?: string, outputPath = 'doc/spec.json', options?: Options) => {
  if (configPath) {
    process.env.PAYLOAD_CONFIG_PATH = configPath;
  }

  const config = await loadConfig();
  const apiDocs = await createDocument(config, options);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(apiDocs, null, 2), 'utf-8');
};
