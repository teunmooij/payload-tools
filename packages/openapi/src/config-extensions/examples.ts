import { CollectionConfig, GlobalConfig } from 'payload/types';

export type Example<T = any> =
  | {
      example?: T;
    }
  | {
      examples: Record<
        string,
        {
          value: T;
          summary?: string;
        }
      >;
    };

export function defineCollection<T = any>(config: CollectionConfig & Example<T>): CollectionConfig {
  const { example, examples, custom, ...rest } = config as CollectionConfig & Record<'example' | 'examples', any>;
  return {
    ...rest,
    custom: {
      ...custom,
      openapi: {
        example,
        examples,
      },
    },
  };
}

export function defineGlobal<T = any>(config: GlobalConfig & Example<T>): GlobalConfig {
  const { example, examples, custom, ...rest } = config as GlobalConfig & Record<'example' | 'examples', any>;
  return {
    ...rest,
    custom: {
      ...custom,
      openapi: {
        example,
        examples,
      },
    },
  };
}
