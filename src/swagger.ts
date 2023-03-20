import { Payload } from 'payload';
import swaggerUi from 'swagger-ui-express';
import { createDocument } from './open-api';
import { Options } from './types';
import { serveFile } from './utils/serve-file';

/**
 * Add swagger routes to a payload server
 */
export const loadSwagger = async (
  { express, config, logger }: Pick<Payload, 'express' | 'config' | 'logger'>,
  options?: Options,
) => {
  if (!express) {
    logger.warn('Unable to load swagger: express not available');
    return;
  }

  const document = await createDocument(config, options);

  express.use('/api-docs/specs', (req, res) => res.json(document));
  if (document.info.license?.url) {
    express.get('/api-docs/license', serveFile('LICENSE'));
  }

  express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: '/api-docs/specs' }));
  logger.info('Swagger URL: /api-docs');
};
