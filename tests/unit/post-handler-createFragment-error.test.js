afterEach(() => {
  jest.resetModules();
});

test('post handler returns 500 when createFragment throws', async () => {
  const mockCreate = jest.fn().mockRejectedValue(new Error('boom'));
  jest.doMock('../../src/model/fragments', () => ({ createFragment: mockCreate }));
  const handler = require('../../src/routes/api/post');

  const req = {
    headers: { 'content-type': 'text/plain', host: 'example.test' },
    body: 'hello',
    ownerId: 'owner-hash',
    protocol: 'http',
  };

  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const res = { status, setHeader: jest.fn() };

  await handler(req, res);

  expect(status).toHaveBeenCalledWith(500);
  expect(json).toHaveBeenCalled();
});
