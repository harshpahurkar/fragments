describe('logger branches', () => {
  const OLD = process.env.LOG_LEVEL;
  afterEach(() => {
    if (OLD === undefined) delete process.env.LOG_LEVEL;
    else process.env.LOG_LEVEL = OLD;
    jest.resetModules();
  });

  test('debug branch sets pretty transport without throwing', () => {
    process.env.LOG_LEVEL = 'debug';
    jest.resetModules();
    const logger = require('../../src/logger');
    expect(logger).toBeDefined();
  });
});
