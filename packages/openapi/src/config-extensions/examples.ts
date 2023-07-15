export interface Example<T = any> {
  example?: T;
  examples?: Record<
    string,
    {
      value: T;
      summary?: string;
    }
  >;
}
