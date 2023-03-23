import { Options as OpenApiOptions } from 'payload-openapi';
import { SwaggerUiOptions } from 'swagger-ui-express';

interface SwaggerOptions {
  /**
   * Customize the payload-swagger routes
   */
  routes?: {
    /**
     * Swagger ui route
     * @default /api-docs
     */
    swagger?: string;
    /**
     * Openapi specs route
     * @default /api-docs/specs
     */
    specs?: string;
    /**
     * License route (requires LICENSE file in root of repository or explicit license url in openapi document)
     * @default /api-docs/license
     */
    license?: string;
  };

  /**
   * Swagger ui options (see swagger-ui documentation)
   */
  ui?: Omit<SwaggerUiOptions, 'swaggerUrl' | 'swaggerUrls'>;
}

/**
 * Payload swagger options
 */
export type Options = OpenApiOptions & SwaggerOptions;
