import type { OpenAPIV3 } from 'openapi-types';
import { Options } from '../options';
import { createResponse } from '../schemas';
import { getAuth } from './route-access';

export const createAccessPath = (options: Options): Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'> => {
  if (!options.include.authPaths) return { paths: {}, components: {} };

  const paths = {
    '/access': {
      get: {
        summary: "Current user's resource access",
        description: "Lists the user's access per resource",
        tags: ['auth'],
        security: [getAuth(options.access.apiKey)],
        responses: {
          '200': createResponse('successful operation', 'access'),
        },
      },
    },
  };

  return {
    paths,
    components: {},
  };
};
