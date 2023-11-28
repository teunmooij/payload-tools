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

function unlinkPackage(workspacePath: string): void {
  const { name: packageName } = parseJSONFile<PackageJson>(path.join(cwd, workspacePath, `package.json`)) ?? {};

  if (!packageName) {
    console.error(`Couldn't parse package.json! in ${workspacePath}`);
    process.exit(1);
  }

  if (!DEFAULT_LOCAL_LINKS.includes(packageName)) {
    return;
  }

  if (serviceDirNames.length === 0) {
    // delete the symbolic link of the package with yarn if it exists
    if (fs.existsSync(path.join(yarnLinkPath, packageName))) {
      console.log(`Deleting yarn symbolic link of ${packageName}.`);
      try {
        execSync(`cd ${workspacePath} && yarn unlink`, { stdio: 'inherit' });
      } catch {
        console.error('Symbolic link deletion failed!');
        process.exit(1);
      }
    } else {
      console.log(`Symbolic link for ${packageName} does not exist.`);
    }

    // if a service repo has a (now broken) link to the local package, force reinstall its dependencies as the `yarn unlink` documentation says
    // there is no real best solution for this issue using yarn v1, using ideas from https://github.com/yarnpkg/yarn/issues/1722 to find links to this specific package and reinstall it

    let rootFileNames: string[];

    console.log('Collecting local service directories to check.');
    try {
      rootFileNames = fs.readdirSync(root);
    } catch {
      console.error("Couldn't collect local service directory names!");
      process.exit(1);
    }

    console.log('Checking service directories and reinstalling remote package if needed.');
    // iterating over files in the directory that contains repositories and checking the service directories for symlinks to the local package
    for (const fileName of rootFileNames) {
      const filePath = path.join(root, fileName);
      let fileStat: fs.Stats;

      try {
        fileStat = fs.lstatSync(filePath);
      } catch {
        console.error(`Couldn't get file stats for ${filePath}!`);
        continue;
      }

      if (fileStat.isDirectory()) {
        const dirName = fileName;
        const servicePath = filePath;
        const packagePath = path.join(servicePath, 'node_modules', packageName);
        let wasLinked: boolean;

        console.log(`Checking ${dirName}.`);
        try {
          wasLinked = fs.lstatSync(packagePath).isSymbolicLink();
        } catch {
          // there is not even a broken symlink at the specified path
          wasLinked = false;
        }

        if (wasLinked) {
          console.log(`${packageName} was linked to ${dirName}, reinstalling remote package.`);
          try {
            execSync('yarn install --force', {
              cwd: servicePath,
              stdio: 'inherit',
            });
          } catch {
            console.error(`Dependency installation failed for ${dirName}!`);
            continue;
          }
        } else {
          console.log(`${packageName} was not linked to ${dirName}.`);
        }
      }
    }
  } else {
    console.log(`Unlinking local package from the following services: ${serviceDirNames.join(', ')}.`);
    // iterate over the specified service repos and unlink the local package from them and reinstall their dependencies
    for (const dirName of serviceDirNames) {
      const servicePath = path.join(root, dirName);

      if (fs.existsSync(servicePath)) {
        const packagePath = path.join(servicePath, 'node_modules', packageName);
        let isLinked: boolean;

        console.log(`Checking if ${packageName} is linked to ${dirName}.`);
        try {
          isLinked = fs.existsSync(packagePath) && fs.lstatSync(packagePath).isSymbolicLink();
        } catch {
          console.error(`Link check failed for ${dirName}!`);
          continue;
        }

        if (isLinked) {
          console.log(`${packageName} is linked to ${dirName}, unlinking local package.`);
          try {
            execSync(`yarn unlink ${packageName}`, {
              cwd: servicePath,
              stdio: 'inherit',
            });
          } catch {
            console.error(`Unlinking failed for ${dirName}!`);
            continue;
          }

          console.log('Reinstalling remote package.');
          try {
            execSync('yarn install --force', {
              cwd: servicePath,
              stdio: 'inherit',
            });
          } catch {
            console.error(`Dependency installation failed for ${dirName}!`);
            continue;
          }
        }
      } else {
        console.warn(`Couldn't find ${dirName}, package unlinking skipped.`);
      }
    }
  }
}

void (async () => {
  const { workspaces } = parseJSONFile<PackageJson>(path.join(cwd, `package.json`)) ?? { workspaces: [] };
  for (const workspace of workspaces) {
    unlinkPackage(workspace);
  }
})();
