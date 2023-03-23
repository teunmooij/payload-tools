import { Payload } from 'payload';
import { createDocument } from 'payload-openapi';
import swaggerUi from 'swagger-ui-express';
import { Options } from './types';
import { serveFile } from './utils/serve-file';

export const loadSwagger = async (
  { express, config, logger }: Pick<Payload, 'express' | 'config' | 'logger'>,
  options: Options = {},
) => {
  if (!express) {
    logger.warn('Unable to load swagger: express not available');
    return;
  }

  const document = await createDocument(config, options);

  const {
    routes: {
      swagger: swaggerRoute = '/api-docs',
      specs: specsRoute = '/api-docs/specs',
      license: licenseRoute = '/api-docs/license',
    } = {},
    ui: uiOptions,
  } = options;

  express.use(specsRoute, (req, res) => res.json(document));
  if (document.info.license?.url) {
    express.get(licenseRoute, serveFile('LICENSE'));
  }

  express.use(swaggerRoute, swaggerUi.serve, swaggerUi.setup(undefined, { ...uiOptions, swaggerUrl: specsRoute }));
  logger.info(`Swagger URL: ${swaggerRoute}`);
};
