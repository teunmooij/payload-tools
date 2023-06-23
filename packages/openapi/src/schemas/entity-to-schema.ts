import type { OpenAPIV3 } from 'openapi-types';
import type { SanitizedConfig } from 'payload/config';
import type { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';
import { entityToJSONSchema as payloadEntityToJSONSchema } from 'payload/utilities';
import convert from '@openapi-contrib/json-schema-to-openapi-schema';
import { getDescription, getSingularSchemaName } from '../utils';

const cleanReferences = (schema: OpenAPIV3.SchemaObject, config: SanitizedConfig): OpenAPIV3.SchemaObject => {
  const asString = JSON.stringify(schema);
  return JSON.parse(
    asString.replace(/#\/definitions\/([^"]+)/g, (_, slug) => {
      const collection = config.collections.find(col => col.slug === slug) || config.globals.find(gl => gl.slug === slug);
      const name = collection ? getSingularSchemaName(collection) : slug;
      return `#/components/schemas/${name}`;
    }),
  );
};

const isReferenceObject = (schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject): schema is OpenAPIV3.ReferenceObject =>
  '$ref' in schema;

// Officialy empty required is allowed for openapi v3 and v3.1, but it's not for swagger v2 and some tools don't accept it
const stripEmptyRequired = (schema: OpenAPIV3.SchemaObject): OpenAPIV3.SchemaObject => {
  if (schema.type === 'array') {
    return {
      ...schema,
      items: isReferenceObject(schema.items) ? schema.items : stripEmptyRequired(schema.items),
    };
  }

  return {
    ...schema,
    properties:
      schema.properties &&
      Object.entries(schema.properties).reduce((all, [key, value]) => {
        all[key] = isReferenceObject(value) ? value : stripEmptyRequired(value);
        return all;
      }, {} as Record<string, OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject>),
    oneOf: schema.oneOf?.map(option => (isReferenceObject(option) ? option : stripEmptyRequired(option))),
    anyOf: schema.anyOf?.map(option => (isReferenceObject(option) ? option : stripEmptyRequired(option))),
    allOf: schema.allOf?.map(option => (isReferenceObject(option) ? option : stripEmptyRequired(option))),
    required: schema.required?.length ? schema.required : undefined,
  };
};

export const entityToSchema = async (
  config: SanitizedConfig,
  incomingEntity: SanitizedCollectionConfig | SanitizedGlobalConfig,
): Promise<OpenAPIV3.SchemaObject> => {
  const jsonschema = payloadEntityToJSONSchema(config, incomingEntity, new Map());
  const rawSchema = await convert(jsonschema);

  return {
    description: getDescription(incomingEntity),
    ...cleanReferences(stripEmptyRequired(rawSchema), config),
  };
};
