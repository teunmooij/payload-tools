import getArgs from 'arg';
import path from 'path';

import initTypescript from './typescript';
import generateDocs from './generate-docs';

const toAbsolutePath = (given: string) => {
  if (path.isAbsolute(given)) {
    return given;
  }
  return path.join(process.cwd(), given);
};

const args = getArgs(
  {
    '--payload': String,
    '--config': String,
    '--output': String,
    '--help': Boolean,

    '-c': '--config',
    '-o': '--output',
    '-p': '--payload',
  },
  { permissive: true },
);

if (args['--help']) {
  // print help
} else {
  const payloadPath = args['--payload'] && toAbsolutePath(args['--payload']);
  const configPath = args['--config'] && toAbsolutePath(args['--config']);
  const outputPath = args['--output'] && toAbsolutePath(args['--output']);

  if (payloadPath) {
    process.chdir(payloadPath);
  }

  initTypescript();
  generateDocs(configPath, outputPath).catch(error => {
    console.error(error);
  });
}
