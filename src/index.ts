import type { Express } from 'express';
import { Payload } from 'payload';
import { Config, SanitizedConfig } from 'payload/config';
import swaggerUi from 'swagger-ui-express';
import { createDocument } from './open-api';
import { Options } from './types';
import { serveFile } from './utils/serve-file';

export { createDocument } from './open-api';

const loadSwagger = async (app: Express, config: SanitizedConfig, options?: Options) => {
  const document = await createDocument(config, options);

  app.use('/api-docs/specs', (req, res) => res.json(document));
  if (document.info.license?.url) {
    app.get('/api-docs/license', serveFile('LICENSE'));
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: '/api-docs/specs' }));
};

export const swagger =
  (options?: Options) =>
  (config: Config): Config => ({
    ...config,
    admin: {
      ...config.admin,
      webpack: webpackConfig => {
        const modifiedConfig = {
          ...webpackConfig,
          resolve: {
            ...webpackConfig.resolve,
            fallback: {
              fs: false,
              async_hooks: false,
              net: false,
              stream: require.resolve('stream-browserify/'),
              url: require.resolve('url/'),
              util: false,
              zlib: false,
              ...webpackConfig.resolve?.fallback,
            },
          },
        } as any;
        if (config.admin?.webpack) {
          return config.admin.webpack(modifiedConfig);
        }
        return modifiedConfig;
      },
    },
    onInit: async (payload: Payload) => {
      if (payload.express) {
        await loadSwagger(payload.express, payload.config, options);
      } else {
        payload.logger.warn('Unable to load swagger: express not available');
      }

      if (config.onInit) {
        return config.onInit(payload);
      }
    },
  });

export default loadSwagger;
