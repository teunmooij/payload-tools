import { greaterOrEqual, supports, toVersion } from '../../src/utils';

describe('version tests', () => {
  it('constructs a version', () => {
    const versionString = '1.2.3';
    const version = toVersion(versionString);

    expect(version).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
    });
  });

  it('is greater when the major version is greater', () => {
    const a = toVersion('2.0.0');
    const b = toVersion('1.0.0');

    expect(greaterOrEqual(a, b)).toBe(true);
    expect(greaterOrEqual(b, a)).toBe(false);
  });

  it('is greater when the minor version is greater', () => {
    const a = toVersion('1.1.0');
    const b = toVersion('1.0.0');

    expect(greaterOrEqual(a, b)).toBe(true);
    expect(greaterOrEqual(b, a)).toBe(false);
  });

  it('is greater when the patch version is greater', () => {
    const a = toVersion('1.0.1');
    const b = toVersion('1.0.0');

    expect(greaterOrEqual(a, b)).toBe(true);
    expect(greaterOrEqual(b, a)).toBe(false);
  });

  it('is greater or equal when the versions are equal', () => {
    const a = toVersion('1.0.0');
    const b = toVersion('1.0.0');

    expect(greaterOrEqual(a, b)).toBe(true);
    expect(greaterOrEqual(b, a)).toBe(true);
  });

  it('is supported if version is undefined', () => {
    const initialVersion = toVersion('1.0.0');
    const currentVersion = undefined;

    const isSupportyed = supports(initialVersion, currentVersion);

    expect(isSupportyed).toBe(true);
  });

  it('is supported if version is greater', () => {
    const initialVersion = toVersion('1.0.0');
    const currentVersion = toVersion('1.1.0');

    const isSupportyed = supports(initialVersion, currentVersion);

    expect(isSupportyed).toBe(true);
  });

  it('is not supported if version is less', () => {
    const initialVersion = toVersion('1.1.0');
    const currentVersion = toVersion('1.0.0');

    const isSupportyed = supports(initialVersion, currentVersion);

    expect(isSupportyed).toBe(false);
  });

  it('is supported if version is equal', () => {
    const initialVersion = toVersion('1.0.0');
    const currentVersion = toVersion('1.0.0');

    const isSupportyed = supports(initialVersion, currentVersion);

    expect(isSupportyed).toBe(true);
  });

  it('is supported if initial version is undefined', () => {
    const initialVersion = undefined;
    const currentVersion = toVersion('1.0.0');

    const isSupportyed = supports(initialVersion, currentVersion);

    expect(isSupportyed).toBe(true);
  });
});
