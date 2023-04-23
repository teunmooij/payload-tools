import { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';

const hasCollectionLabel = (collection: any, kind: 'singular' | 'plural'): collection is SanitizedCollectionConfig =>
  Boolean(collection.labels?.[kind]);

export const getLabels = (
  collection: SanitizedCollectionConfig | SanitizedGlobalConfig,
  kind: 'singular' | 'plural',
): string | Record<string, string> | undefined =>
  hasCollectionLabel(collection, kind) ? collection.labels[kind] : collection.label;
