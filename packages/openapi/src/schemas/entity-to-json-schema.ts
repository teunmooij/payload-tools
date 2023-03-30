import type { OpenAPIV3 } from 'openapi-types';
import type { SanitizedConfig } from 'payload/config';
import type { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';
import { entityToJSONSchema as payloadEntityToJSONSchema } from 'payload/utilities';

export const entityToJSONSchema = (
  config: SanitizedConfig,
  incomingEntity: SanitizedCollectionConfig | SanitizedGlobalConfig,
): OpenAPIV3.SchemaObject => {
  const schema = payloadEntityToJSONSchema(config, incomingEntity);
  const asString = JSON.stringify(schema);
  return JSON.parse(asString.replace(/#\/definitions\//g, '#/components/schemas/'));
};
