import type { OpenAPIV3 } from 'openapi-types';
import { Options } from '../options';
import { createResponse } from '../schemas';

export const createAccessPath = (options: Options): OpenAPIV3.PathsObject => ({
  '/access': {
    get: {
      summary: "Current user's resource access",
      description: "Lists the user's access per resource",
      tags: ['auth'],
      security: [
        {
          basicAuth: [],
          cookieAuth: [],
          ...(options.access.apiKey ? { apiKeyAuth: [] } : {}),
        },
      ],
      responses: {
        '200': createResponse('successful operation', 'access'),
      },
    },
  },
});
