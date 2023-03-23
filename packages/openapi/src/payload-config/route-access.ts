import type { OpenAPIV3 } from 'openapi-types';
import { Access, SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';

const allowsAnonymous = async (access: Access): Promise<boolean> => {
  try {
    const result = await access({ req: {} as any });
    return !!result;
  } catch {
    return false;
  }
};

export const getRouteAccess = async (
  collection: SanitizedCollectionConfig | SanitizedGlobalConfig,
  operation: keyof SanitizedCollectionConfig['access'],
  disableAccessAnalysis: boolean,
): Promise<OpenAPIV3.SecurityRequirementObject[] | undefined> => {
  const access = (collection.access as any)[operation] as Access | undefined;

  if (!access) {
    // default: any logged in user
    return [{ basicAuth: [], cookieAuth: [] }];
  }

  if (disableAccessAnalysis || (await allowsAnonymous(access))) return undefined;

  // If anonymous is not allow, we'll asume there's basic security
  return [{ basicAuth: [], cookieAuth: [] }];
};
