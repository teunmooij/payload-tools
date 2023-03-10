import type { SchemaObject } from 'openapi3-ts';

import access from './access';
import login from './login';
import me from './me';

const schemas: Record<string, SchemaObject> = {
  login,
  access,
  me,
};

export default schemas;
