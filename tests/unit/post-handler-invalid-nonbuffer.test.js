afterEach(() => {
  jest.resetModules();
});

test('post handler returns 400 for invalid json when req.body is string (non-buffer)', async () => {
  const mockCreate = jest.fn();
  jest.doMock('../../src/model/fragments', () => ({ createFragment: mockCreate }));
  const handler = require('../../src/routes/api/post');

  const req = {
    headers: { 'content-type': 'application/json', host: 'example.test' },
    body: 'not a json',
    ownerId: 'owner-hash',
    protocol: 'http',
  };

  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const res = { status, setHeader: jest.fn() };

  await handler(req, res);

  expect(status).toHaveBeenCalledWith(400);
  expect(json).toHaveBeenCalled();
});
