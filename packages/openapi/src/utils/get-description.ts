import { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';

const hasCollectionLabel = (collection: any, kind: 'singular' | 'plural'): collection is SanitizedCollectionConfig =>
  Boolean(collection.labels?.[kind]);

const getText = (labels: string | Record<string, string> | undefined): string | undefined => {
  if (typeof labels === 'string' || !labels) return labels;

  return labels.docs || labels.en || Object.values(labels).find(label => label && typeof label === 'string');
};

export const getSingular = (collection: SanitizedCollectionConfig | SanitizedGlobalConfig): string => {
  const labels = hasCollectionLabel(collection, 'singular') ? collection.labels.singular : collection.label;

  return getText(labels) || collection.slug;
};

export const getPlural = (collection: SanitizedCollectionConfig | SanitizedGlobalConfig): string => {
  const labels = hasCollectionLabel(collection, 'plural') ? collection.labels.plural : collection.label;

  return getText(labels) || collection.slug;
};

export const getDescription = (collection: SanitizedCollectionConfig | SanitizedGlobalConfig) => {
  const description = collection.admin?.description;
  if (typeof description === 'string') return description;
  if (typeof description === 'object') {
    const label = getText(description);
    if (label) return label;
  }
  if (typeof description === 'function') {
    try {
      const value = description();
      if (typeof value === 'string') return value;
    } catch {
      // ignore
    }
  }

  return getPlural(collection);
};
