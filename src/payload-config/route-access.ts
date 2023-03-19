import { SecurityRequirementObject } from 'openapi3-ts';
import { Access, SanitizedCollectionConfig } from 'payload/types';

const allowsAnonymous = async (access: Access): Promise<boolean> => {
  try {
    const result = await access({ req: {} as any });
    return !!result;
  } catch {
    return false;
  }
};

export const getRouteAccess = async (
  collection: SanitizedCollectionConfig,
  operation: keyof SanitizedCollectionConfig['access'],
  disableAccessAnalysis: boolean,
): Promise<SecurityRequirementObject[] | undefined> => {
  const access = collection.access[operation];

  if (!access) {
    // default: any logged in user
    return [{ basicAuth: [] }];
  }

  if (disableAccessAnalysis || (await allowsAnonymous(access))) return undefined;

  // If anonymous is not allow, we'll asume there's basic security
  return [{ basicAuth: [] }];
};
