import { SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';

export const getDescription = (collection: SanitizedCollectionConfig | SanitizedGlobalConfig) => {
  const description = collection.admin?.description;
  if (typeof description === 'string') return description;
  if (typeof description === 'function') {
    try {
      const value = description();
      if (typeof value === 'string') return value;
    } catch {
      // ignore
    }
  }

  return collection.slug;
};
