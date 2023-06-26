import { SanitizedConfig } from 'payload/config';
import { Version, getPayloadVersion, supports, toVersion } from './utils';

/**
 * Payload openapi options
 */
export interface RawOptions {
  /**
   * By default the access functions on all collections in the config are called to determine the access level of the operations.
   * @type {boolean} set to `true` to disable this behaviour
   * @type {string[]} or list the collections for which to opt out
   */
  disableAccessAnalysis?: boolean | string[];
  /**
   * Exclude parts of the payload config from document generation
   */
  exclude?: {
    authPaths?: boolean;
    authCollection?: boolean;
    passwordRecovery?: boolean;
    preferences?: boolean;
    custom?: boolean;
  };
  /**
   * Payload version is automatically determined.
   * If this is not possible (for instance in monorepo), it can be provided as option
   */
  payloadVersion?: string;
}

export interface Options {
  payloadVersion?: Version;
  access: {
    analyze: (slug: string) => boolean;
    cookieName: string;
    apiKey: boolean;
  };
  include: {
    authPaths: boolean;
    authCollection: boolean;
    passwordRecovery: boolean;
    preferences: boolean;
    custom: boolean;
  };
  supports: {
    bulkOperations: boolean;
  };
}

export const parseOptions = async (options: RawOptions = {}, payloadConfig: SanitizedConfig): Promise<Options> => {
  const payloadVersion = options.payloadVersion ? toVersion(options.payloadVersion) : await getPayloadVersion();

  return {
    payloadVersion,
    access: {
      analyze: Array.isArray(options.disableAccessAnalysis)
        ? slug => !(options.disableAccessAnalysis as string[]).includes(slug)
        : () => !options.disableAccessAnalysis,
      cookieName: `${payloadConfig.cookiePrefix || 'payload'}-token`,
      apiKey: payloadConfig.collections.some(collection => collection.auth?.useAPIKey),
    },
    include: {
      authPaths: !options.exclude?.authPaths,
      authCollection: !options.exclude?.authCollection,
      passwordRecovery: options.exclude?.passwordRecovery === false,
      preferences: options.exclude?.preferences === false,
      custom: !options.exclude?.custom,
    },
    supports: {
      bulkOperations: supports(toVersion('1.6.24'), payloadVersion),
    },
  };
};
