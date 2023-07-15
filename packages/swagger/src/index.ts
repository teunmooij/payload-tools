import { swagger } from './plugin';

export type { Options } from './types';

export { swagger };
export default swagger;

export { defineCollection, defineEndpoint, defineGlobal, EndpointDocumentation, Example } from './openapi';
