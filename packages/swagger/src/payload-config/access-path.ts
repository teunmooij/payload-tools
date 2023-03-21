import { PathObject } from 'openapi3-ts';
import { createResponse } from '../schemas';

export const createAccessPath = (): PathObject => ({
  '/access': {
    get: {
      summary: "Current user's resource access",
      description: "Lists the user's access per resource",
      tags: ['auth'],
      security: [{ basicAuth: [], cookieAuth: [] }],
      responses: {
        '200': createResponse('successful operation', 'access'),
      },
    },
  },
});
