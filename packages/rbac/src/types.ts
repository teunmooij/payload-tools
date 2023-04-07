import type { SelectField, Access as PayloadAccess, AccessArgs } from 'payload/types';

type NotNull<T> = T extends null ? never : T;

// eslint-disable-next-line @typescript-eslint/ban-types
export type User<TRoles extends string = string, TRest extends object = {}> = NotNull<AccessArgs<any, {}>['req']['user']> & {
  roles: TRoles[];
} & TRest;

export type Role<TUser extends User> = TUser extends User<infer TRoles, any> ? TRoles : never;

export type Access<TData = any, TUser extends User = User> = PayloadAccess<TData, TUser>;

export interface Options {
  collections?: string[];
  roles: SelectField['options'];
  defaultRoles?: string[];
}
