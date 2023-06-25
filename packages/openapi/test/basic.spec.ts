import path from 'path';
import loadConfig from 'payload/dist/config/load';
import parser from '@apidevtools/swagger-parser';
import type { OpenAPIV3 } from 'openapi-types';

import { createDocument } from '../src';
import expectedSchema from './basic.expected.json';

describe('basic tests', () => {
  let apiDocs: OpenAPIV3.Document;

  beforeAll(async () => {
    process.env.PAYLOAD_CONFIG_PATH = path.join(__dirname, 'basic.config.ts');
    const config = await loadConfig();
    apiDocs = await createDocument(config);
  });

  it('creates a valid openapi document', async () => {
    await parser.validate(JSON.parse(JSON.stringify(apiDocs)));
  });

  it('creates the expected document', async () => {
    expect(apiDocs).toEqual(expectedSchema);
  });
});
