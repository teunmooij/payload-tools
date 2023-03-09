import { greet } from '../src';

describe('tests', () => {
  it('logs a greeting', () => {
    const logger = { log: jest.fn() };
    const name = 'Teun';

    greet(name, logger);

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(`Hello ${name}!`);
  });
});
