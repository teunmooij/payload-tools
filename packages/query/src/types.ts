import { Operator } from 'payload/types';
import type { ObjectPaths, ValueAtPath, Join, Split, IsAny } from 'ts-powertypes';

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

export type Filter<TCollection extends object = Record<string, unknown>> = {
  [K in PathToString<ObjectPaths<TCollection>>]?: WhereField<ValueAtPath<TCollection, Split<K, '.'>>>;
} & {
  or?: Filter<TCollection>[];
  and?: Filter<TCollection>[];
};

export type Query<TCollection extends object = Record<string, unknown>, TData = unknown> = {
  [K in PathToString<ObjectPaths<TCollection>>]?: ActiveWhereField<ValueAtPath<TCollection, Split<K, '.'>>, TData>;
} & {
  or?: Query<TCollection, TData>[];
  and?: Query<TCollection, TData>[];
};
