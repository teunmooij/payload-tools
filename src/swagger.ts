import type { Express } from 'express';
import type { SanitizedConfig } from 'payload/config';
import swaggerUi from 'swagger-ui-express';
import { createDocument } from './open-api';
import { Options } from './types';
import { serveFile } from './utils/serve-file';

/**
 * Add swagger routes to a payload server
 */
export const loadSwagger = async (app: Express, config: SanitizedConfig, options?: Options) => {
  const document = await createDocument(config, options);

  app.use('/api-docs/specs', (req, res) => res.json(document));
  if (document.info.license?.url) {
    app.get('/api-docs/license', serveFile('LICENSE'));
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: '/api-docs/specs' }));
};
