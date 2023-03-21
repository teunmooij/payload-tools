import { SanitizedConfig } from 'payload/config';
import { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';
import { entityToJSONSchema as payloadEntityToJSONSchema } from 'payload/utilities';

export const entityToJSONSchema = (
  config: SanitizedConfig,
  incomingEntity: SanitizedCollectionConfig | SanitizedGlobalConfig,
) => {
  const schema = payloadEntityToJSONSchema(config, incomingEntity);
  const asString = JSON.stringify(schema);
  return JSON.parse(asString.replace(/#\/definitions\//g, '#/components/schemas/'));
};
