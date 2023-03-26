import type { OpenAPIV3 } from 'openapi-types';
import { Access, SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload/types';
import { Options } from '../options';

const allowsAnonymous = async (access: Access): Promise<boolean> => {
  try {
    const result = await access({ req: {} as any });
    return !!result;
  } catch {
    return false;
  }
};

const getAuth = (includeApiKeyAuth: boolean) => ({
  basicAuth: [],
  cookieAuth: [],
  ...(includeApiKeyAuth ? { apiKeyAuth: [] } : {}),
});

export const getRouteAccess = async (
  collection: SanitizedCollectionConfig | SanitizedGlobalConfig,
  operation: keyof SanitizedCollectionConfig['access'],
  options: Options['access'],
): Promise<OpenAPIV3.SecurityRequirementObject[] | undefined> => {
  const access = (collection.access as any)[operation] as Access | undefined;

  if (!access) {
    // default: any logged in user
    return [getAuth(options.apiKey)];
  }

  if (!options.analyze(collection.slug) || (await allowsAnonymous(access))) return undefined;

  // If anonymous is not allow, we'll asume there's basic security
  return [getAuth(options.apiKey)];
};
