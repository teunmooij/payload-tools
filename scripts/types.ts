export interface PackageJson {
  name: string;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  workspaces: string[];
}
