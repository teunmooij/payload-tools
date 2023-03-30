import type { OpenAPIV3 } from 'openapi-types';
import { Options } from '../../../options';
import { createRef, createResponse } from '../../../schemas';
import { getAuth } from '../../route-access';

import access from './access-schema';

export const createAccessRoute = (options: Options): Pick<Required<OpenAPIV3.Document>, 'paths' | 'components'> => {
  if (!options.include.authPaths) return { paths: {}, components: {} };

  const paths = {
    '/access': {
      get: {
        summary: "Current user's resource access",
        description: "Lists the user's access per resource",
        tags: ['auth'],
        security: [getAuth(options.access.apiKey)],
        responses: {
          '200': createRef('access', 'responses'),
        },
      },
    },
  };

  return {
    paths,
    components: {
      responses: {
        accessResponse: createResponse('ok', 'access'),
      },
      schemas: {
        access,
      },
    },
  };
};
