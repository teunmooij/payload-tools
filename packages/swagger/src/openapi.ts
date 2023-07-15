import { Endpoint } from 'payload/config';

import type { EndpointDocumentation } from 'payload-openapi';
export type { EndpointDocumentation } from 'payload-openapi';

type DocumentedEndpoint = Endpoint & EndpointDocumentation;

export function defineEndpoint(endpoint: DocumentedEndpoint): Endpoint {
  const { summary, description, responseSchema, errorResponseSchemas, queryParameters, custom, ...rest } = endpoint;
  return {
    ...rest,
    custom: {
      ...custom,
      openapi: {
        summary,
        description,
        responseSchema,
        errorResponseSchemas,
        queryParameters,
      },
    },
  };
}
