export type DeepPartial<T extends object> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] | undefined;
};

export type NonEmptyArray<T> = [T, ...T[]];
