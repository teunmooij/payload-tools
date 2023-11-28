import { execSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { PackageJson } from './types';
import { DEFAULT_LOCAL_LINKS, parseJSONFile } from './utils';

const cwd = process.cwd();
const root = path.join(cwd, '..');
const serviceDirNames = process.argv.slice(2);
const yarnLinkPath = path.join(os.homedir(), '.config', 'yarn', 'link');

function linkPackage(workspacePath: string): void {
  const { name: packageName } = parseJSONFile<PackageJson>(path.join(cwd, workspacePath, `package.json`)) ?? {};
  if (!packageName) {
    console.error(`Couldn't parse package.json! in ${workspacePath}`);
    process.exit(1);
  }

  if (!DEFAULT_LOCAL_LINKS.includes(packageName)) {
    return;
  }

  // Create a symbolic link of the SDK package with yarn if it does not yet exist
  console.log(`Checking if a symbolic link for ${packageName} is registered with yarn.`);
  if (!fs.existsSync(path.join(yarnLinkPath, packageName))) {
    console.log(`Creating yarn symbolic link for ${packageName}.`);
    try {
      execSync(`cd ${workspacePath} && yarn link`, { stdio: 'inherit' });
    } catch {
      console.error('Symbolic link creation failed!');
      process.exit(1);
    }
  } else {
    console.log(`Symbolic link for ${packageName} already exists.`);
  }

  if (serviceDirNames.length !== 0) {
    console.log(`Linking local SDK package to the following services: ${serviceDirNames.join(', ')}.`);
    // iterate over the service directories specified in the command line arguments
    for (const dirName of serviceDirNames) {
      const servicePath = path.join(root, dirName);
      console.log({ servicePath });
      // link the local folder of the SDK package as the installed dependency of this service
      if (fs.existsSync(servicePath)) {
        console.log(`Linking ${packageName} to ${dirName}.`);
        try {
          execSync(`yarn link ${packageName}`, { cwd: servicePath, stdio: 'inherit' });
        } catch {
          console.error(`Package linking failed for ${dirName}.`);
          continue;
        }
      } else {
        console.warn(`Couldn't find ${dirName}, package linking skipped.`);
      }
    }
  } else {
    console.log(
      'No services specified for linking. If you want to link some, list their directory names as command line arguments for this script.',
    );
  }
}

void (async () => {
  const { workspaces } = parseJSONFile<PackageJson>(path.join(cwd, `package.json`)) ?? { workspaces: [] };
  for (const workspace of workspaces) {
    linkPackage(workspace);
  }
})();
