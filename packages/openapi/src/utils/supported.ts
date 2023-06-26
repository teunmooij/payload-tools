import { OpenAPIV3 } from 'openapi-types';
import { entityToJSONSchema } from 'payload/utilities';
import { Options } from '../options';
import createBaseConfig from '../base-config';
import { Version, greaterOrEqual, toVersion } from './version';

export const isSupported = (version?: Version) => {
  if (
    !version ||
    greaterOrEqual(toVersion('1.6.0'), version) ||
    (greaterOrEqual(version, toVersion('1.9.3')) && greaterOrEqual(toVersion('1.10.1'), version))
  ) {
    return typeof entityToJSONSchema === 'function';
  }

  // If the version is not any of the known unsupported versions, it should supported.
  // If it's not, we might have a bug and we don't want to hide that.
  return true;
};

export const getUnsupportedSchema = (options: Options): OpenAPIV3.Document => {
  const base = createBaseConfig(options);
  return {
    ...base,
    info: {
      ...base.info,
      description: `OpenAPI documentation is not supported for this version of Payload.<br/>
        Please make sure  you are using payload version 1.6.1 or higher, but not between 1.9.3 and 1.10.1.`,
    },
  };
};
