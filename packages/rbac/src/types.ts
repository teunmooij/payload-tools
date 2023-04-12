import type { SelectField, Access as PayloadAccess, AccessArgs } from 'payload/types';
import { Operator } from 'payload/types';
import type { ObjectPaths, ValueAtPath, Join, Split, IsAny } from 'ts-powertypes';

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

type GreaterLessOperand<Field> = IsAny<Field> extends true
  ? number | Date
  : Field extends number
  ? number
  : Field extends Date
  ? Date
  : Field extends bigint
  ? bigint
  : never;

type StringOperand<Field> = IsAny<Field> extends true ? string : Field extends string ? Field : never;

type NearOperand<Field> = Field extends [number, number] ? [number | null | undefined, number | null | undefined] : never;

type Operand<Field, O extends Operator> = O extends 'equals'
  ? Field
  : O extends 'not_equals'
  ? Field
  : O extends 'greater_than'
  ? GreaterLessOperand<Field>
  : O extends 'greater_than_equal'
  ? GreaterLessOperand<Field>
  : O extends 'less_than'
  ? GreaterLessOperand<Field>
  : O extends 'less_than_equal'
  ? GreaterLessOperand<Field>
  : O extends 'like'
  ? StringOperand<Field>
  : O extends 'contains'
  ? StringOperand<Field>
  : O extends 'in'
  ? Field[]
  : O extends 'not_in'
  ? Field[]
  : O extends 'exists'
  ? boolean
  : O extends 'near'
  ? NearOperand<Field>
  : never;

type WhereField<Field> = {
  [O in Operator]?: Operand<Field, O>;
};

type ActiveWhereField<Field, TInput> = {
  [O in Operator]?: Operand<Field, O> | ((input: TInput) => Operand<Field, O>);
};

type PathToString<T> = T extends any ? Join<T, '.'> : never;

export type Where<T extends object = any> = {
  [K in PathToString<ObjectPaths<T>>]?: WhereField<ValueAtPath<T, Split<K, '.'>>>;
} & {
  or?: Where<T>[];
  and?: Where<T>[];
};

export type AccessQuery<T extends object = any, TUser extends User = User> = {
  [K in PathToString<ObjectPaths<T>>]?: ActiveWhereField<ValueAtPath<T, Split<K, '.'>>, AccessArgs<T, TUser>>;
} & {
  or?: (AccessQuery<T, TUser> | Where<T>)[];
  and?: (AccessQuery<T, TUser> | Where<T>)[];
  _toWhere: (args: AccessArgs<T, TUser>) => Where<T>;
};
