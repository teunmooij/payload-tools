import { createDocument } from './open-api';

export type { RawOptions as Options } from './options';

export { createDocument };
export default createDocument;

export { defineEndpoint, EndpointDocumentation, Example } from './config-extensions';
