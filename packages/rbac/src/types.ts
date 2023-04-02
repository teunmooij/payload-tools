import type { SelectField } from 'payload/types';

export interface Options {
  collections?: string[];
  roles: SelectField['options'];
  defaultRoles?: string[];
}
