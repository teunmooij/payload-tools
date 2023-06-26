import path from 'path';

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export const toVersion = (versionString: string): Version => {
  const parts = versionString.split('.');

  return {
    major: Number(parts[0]),
    minor: Number(parts[1]),
    patch: Number(parts[2]),
  };
};

export const greaterOrEqual = (a: Version, b: Version) =>
  a.major > b.major || (a.major === b.major && (a.minor > b.minor || (a.minor === b.minor && a.patch >= b.patch)));

export const supports = (initialVersion: Version | undefined, currentVersion: Version | undefined) => {
  if (!initialVersion || !currentVersion) return true;

  return greaterOrEqual(currentVersion, initialVersion);
};

export const getPayloadVersion = async (): Promise<Version | undefined> => {
  try {
    const { version } = await import(path.join(process.cwd(), 'node_modules/payload/package.json'));
    return version ? toVersion(version) : undefined;
  } catch (e) {
    return undefined;
  }
};
