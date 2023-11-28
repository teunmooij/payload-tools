import * as fs from 'fs';

export const DEFAULT_LOCAL_LINKS = ['payload-swagger', 'payload-openapi'];
export function parseJSONFile<T>(path: string): T | undefined {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8')) as T;
  } catch {
    return undefined;
  }
}
