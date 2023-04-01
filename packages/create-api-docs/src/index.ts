import initTypescript from './typescript';
import generateDocs from './generate-docs';
import { getOptions, showHelp } from './options';

const { help, payloadPath, configPath, outputPath, generatorOptions } = getOptions();

if (help) {
  showHelp();
} else {
  if (payloadPath) {
    process.chdir(payloadPath);
  }

  initTypescript();
  generateDocs(configPath, outputPath, generatorOptions).catch(error => {
    console.error(error);
    process.exit(1);
  });
}
