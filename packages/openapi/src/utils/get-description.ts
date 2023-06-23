import { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';
import { getLabels } from './get-label';

const getText = (labels: string | Record<string, string> | undefined): string | undefined => {
  if (typeof labels === 'string' || !labels) return labels;

  return labels.docs || labels.en || Object.values(labels).find(label => label && typeof label === 'string');
};

export const getSingular = (collection: SanitizedCollectionConfig | SanitizedGlobalConfig): string => {
  const labels = getLabels(collection, 'singular');

  return getText(labels) || collection.slug;
};

export const getPlural = (collection: SanitizedCollectionConfig | SanitizedGlobalConfig): string => {
  const labels = getLabels(collection, 'plural');

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
      const value = (description as any)();
      if (typeof value === 'string') return value;
    } catch {
      // ignore
    }
  }

  return undefined;
};
