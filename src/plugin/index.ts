import { Payload } from 'payload';
import { Config } from 'payload/config';
import { loadSwagger } from '../swagger';
import { Options } from '../types';

/**
 * Payload swagger plugin
 */
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
              stream: require.resolve('stream-browserify'),
              url: require.resolve('url'),
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
