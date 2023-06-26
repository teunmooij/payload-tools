import { toVersion, isSupported } from '../../src/utils';

jest.mock('payload/utilities', () => ({
  entityToJSONSchema: 'not a function',
}));

describe('isSupported tests', () => {
  it('is supported if version is 1.6.1', () => {
    const version = toVersion('1.6.1');

    const supported = isSupported(version);

    expect(supported).toBe(true);
  });

  it('might not be supported if version is smaller than 1.6.1', () => {
    const version = toVersion('1.6.0');

    const supported = isSupported(version);

    expect(supported).toBe(false);
  });

  it('is not supported if version is between 1.9.3 and 1.10.1', () => {
    expect(isSupported(toVersion('1.9.3'))).toBe(false);
    expect(isSupported(toVersion('1.9.4'))).toBe(false);
    expect(isSupported(toVersion('1.9.5'))).toBe(false);
    expect(isSupported(toVersion('1.10.0'))).toBe(false);
    expect(isSupported(toVersion('1.10.1'))).toBe(false);
  });
});
