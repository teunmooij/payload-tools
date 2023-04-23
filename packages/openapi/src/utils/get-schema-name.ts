import { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';
import { getLabels } from './get-label';

const getText = (collection: SanitizedCollectionConfig | SanitizedGlobalConfig, kind: 'singular' | 'plural'): string => {
  const labels = getLabels(collection, kind);
  if (typeof labels === 'object' && labels.openapi) return labels.openapi;
  return kind === 'singular' ? collection.slug : `${getText(collection, 'singular')}s`;
};

export const getSingularSchemaName = (collection: SanitizedCollectionConfig | SanitizedGlobalConfig): string =>
  getText(collection, 'singular');

export const getPluralSchemaName = (collection: SanitizedCollectionConfig | SanitizedGlobalConfig): string =>
  getText(collection, 'plural');
