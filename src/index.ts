import { Express } from 'express';
import { SanitizedConfig } from 'payload/config';
import swaggerUi from 'swagger-ui-express';
import { createDocument } from './swagger';

export { createDocument } from './swagger';

export default async (app: Express, config: SanitizedConfig) => {
  const document = await createDocument(config);

  app.use('/api-specs', (req, res) => res.json(document));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: '/api-specs' }));
};
