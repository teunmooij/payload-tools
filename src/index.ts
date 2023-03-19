import type { Express } from 'express';
import { SanitizedConfig } from 'payload/config';
import swaggerUi from 'swagger-ui-express';
import { createDocument } from './open-api';
import { Options } from './types';
import { serveFile } from './utils/serve-file';

export { createDocument } from './open-api';

export default async (app: Express, config: SanitizedConfig, options?: Options) => {
  const document = await createDocument(config);

  app.use('/api-docs/specs', (req, res) => res.json(document));
  if (document.info.license?.url) {
    app.get('/api-docs/license', serveFile('LICENSE'));
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: '/api-docs/specs' }));
};
