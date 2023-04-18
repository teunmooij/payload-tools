import { select } from '../src';

describe('select tests', () => {
  it('returns the selected fields', () => {
    const fields = { id: true, name: true };
    const document = { id: 123, name: 'foo', bar: 'baz' };

    const result = select(fields, document);

    expect(result).toEqual({ id: 123, name: 'foo' });
  });

  it('includes the id if not selected', () => {
    const fields = { name: true };
    const document = { id: 123, name: 'foo', bar: 'baz' };

    const result = select(fields, document);

    expect(result).toEqual({ id: 123, name: 'foo' });
  });

  it('excludes the id if explicitely excluded', () => {
    const fields = { id: false, name: true };
    const document = { id: 123, name: 'foo', bar: 'baz' };

    const result = select(fields, document);

    expect(result).toEqual({ name: 'foo' });
  });

  it('is curried', () => {
    const fields = { name: true };
    const document = { id: 123, name: 'foo', bar: 'baz' };

    const nameSelect = select<{ id: number; name: string; bar: string }>(fields);

    const result = nameSelect(document);

    expect(result).toEqual({ id: 123, name: 'foo' });
  });
});
