import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import path from 'path';

import { Options as OpenapiOptions } from 'payload-openapi';

const optionList = [
  {
    name: 'payload',
    alias: 'p',
    type: String,
    description: 'Path to payload root folder, required if not current folder',
    group: 'basic',
  },
  {
    name: 'config',
    alias: 'c',
    type: String,
    description: 'Path to payload config',
    group: 'basic',
  },
  {
    name: 'output',
    alias: 'o',
    type: String,
    description: 'Location to store the payload docs, default <payload-root-folder>/doc/spec.json',
    group: 'basic',
  },
  {
    name: 'help',
    type: Boolean,
    description: 'shows this help screen',
  },
  {
    name: 'disableAllAccessAnalysis',
    type: Boolean,
    description: 'Disable all endpoint access analysis',
    group: 'options',
  },
  {
    name: 'disableAccessAnalysis',
    multiple: true,
    type: String,
    description: 'Disable endpoint analysis for the collections with the given slugs',
    group: 'options',
  },
  {
    name: 'excludeAuthPaths',
    type: Boolean,
    description: 'Exclude auth paths from the openapi document',
    group: 'options',
  },
  {
    name: 'excludeAuthCollection',
    type: Boolean,
    description: 'Exclude paths of auth collections from the openapi document',
    group: 'options',
  },
  {
    name: 'includePasswordRecovery',
    type: Boolean,
    description: 'Include password recovery paths in the openapi documents',
    group: 'options',
  },
  {
    name: 'includePreferences',
    type: Boolean,
    description: 'Include preference paths in the openapi documents',
    group: 'options',
  },
  {
    name: 'excludeCustom',
    type: Boolean,
    description: 'Exclude custom paths from the openapi documents',
    group: 'options',
  },
];

const sections = [
  {
    header: 'create-payload-api-docs',
    content: `Run 'npx create-payload-api-docs' from the root folder of your payload repository to generate the openapi docs.

    For more options, see the options list below.`,
  },
  {
    header: 'Basic configuration',
    optionList,
    group: ['basic'],
  },
  {
    header: 'Generator options\n\nSee payload-openapi docs for more details: https://www.npmjs.com/package/payload-openapi',
    optionList,
    group: ['options'],
  },
];

type Options = {
  help?: boolean;
  payloadPath?: string;
  configPath?: string;
  outputPath?: string;
  generatorOptions: OpenapiOptions;
};

const toAbsolutePath = (value?: string) => {
  if (!value || path.isAbsolute(value)) {
    return value;
  }
  return path.join(process.cwd(), value);
};

const toOpenapiOptions = (args: commandLineArgs.CommandLineOptions): OpenapiOptions => ({
  disableAccessAnalysis: args.disableAllAccessAnalysis || args.disableAccessAnalysis,
  exclude: {
    authPaths: args.excludeAuthPaths,
    authCollection: args.excludeAuthCollection,
    passwordRecovery: !args.includePasswordRecovery,
    preferences: !args.includePreferences,
    custom: args.excludeCustom,
  },
});

export const getOptions = (): Options => {
  const args = commandLineArgs(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    optionList.map(({ description, group, ...rest }) => rest),
    { caseInsensitive: true },
  );

  return {
    help: args.help,
    payloadPath: toAbsolutePath(args.payload),
    configPath: toAbsolutePath(args.config),
    outputPath: toAbsolutePath(args.output),
    generatorOptions: toOpenapiOptions(args),
  };
};

export const showHelp = () => {
  const usage = commandLineUsage(sections);
  console.log(usage);
};
