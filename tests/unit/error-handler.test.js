// tests/unit/error-handler.test.js

const { createErrorResponse } = require('../../src/response');

describe('Error handler', () => {
  test('should handle errors and return JSON error response', async () => {
    // Create a fake error and mocked res object
    const err = new Error('upstream failure');
    err.status = 502;

    const resMock = {};
    resMock.status = jest.fn(() => resMock);
    resMock.json = jest.fn(() => resMock);

    // Call the exported errorHandler directly
    const { errorHandler } = require('../../src/app');
    errorHandler(err, {}, resMock, () => {});

    expect(resMock.status).toHaveBeenCalledWith(502);
    expect(resMock.json).toHaveBeenCalledWith(createErrorResponse(502, 'upstream failure'));
  });
});
