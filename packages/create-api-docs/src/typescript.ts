import swcRegister from '@swc/register';
import { getTsconfig } from 'get-tsconfig';

export default () => {
  const tsConfig = getTsconfig();

  const swcOptions: any = {
    sourceMaps: 'inline',
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      paths: undefined,
      baseUrl: undefined,
    },
    module: {
      type: 'commonjs',
    },
    ignore: [/.*\/node_modules\/.*/],
  };

  if (tsConfig?.config?.compilerOptions?.paths) {
    swcOptions.jsc.paths = tsConfig?.config?.compilerOptions?.paths;

    if (tsConfig?.config?.compilerOptions?.baseUrl) {
      swcOptions.jsc.baseUrl = tsConfig?.config?.compilerOptions?.baseUrl;
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - bad @swc/register types
  swcRegister(swcOptions);
};
