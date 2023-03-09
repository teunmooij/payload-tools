export const greet = (name: string, logger: { log: (text: string) => void } = console) => {
  logger.log(`Hello ${name}!`);
};
