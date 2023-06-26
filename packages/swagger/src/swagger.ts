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

  const {
    routes: {
      swagger: swaggerRoute = '/api-docs',
      specs: specsRoute = '/api-docs/specs',
      license: licenseRoute = '/api-docs/license',
    } = {},
    ui: uiOptions,
  } = options;

  try {
    const document = await createDocument(config, options);
    express.use(specsRoute, (req, res) => res.json(document));

    if (document.info.license?.url) {
      express.get(licenseRoute, serveFile('LICENSE'));
    }
  } catch (error) {
    if (options.throwOnError) {
      throw error;
    }

    logger.error(error, 'Unable to load swagger');
    express.use(specsRoute, (req, res) =>
      res.json({
        openapi: '3.0.3',
        info: {
          title: 'Unable to load openapi document',
          description: 'An error occurred while generating the openapi document. Please check the server logs for more details.',
        },
      }),
    );
  } finally {
    express.use(swaggerRoute, swaggerUi.serve, swaggerUi.setup(undefined, { ...uiOptions, swaggerUrl: specsRoute }));
    logger.info(`Swagger URL: ${swaggerRoute}`);
  }
};
