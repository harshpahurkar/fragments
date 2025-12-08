describe('post handler unit tests (non-buffer body)', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles req.body as object for application/json', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ id: 'abc123', content: '{"a":1}' });
    jest.doMock('../../src/model/fragments', () => ({ createFragment: mockCreate }));

    const handler = require('../../src/routes/api/post');

    const req = {
      headers: { 'content-type': 'application/json', host: 'example.test' },
      body: { a: 1 },
      ownerId: 'owner-hash',
      protocol: 'http',
      query: {},
    };

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status, setHeader: jest.fn() };

    await handler(req, res);

    expect(mockCreate).toHaveBeenCalledWith('owner-hash', {
      content: JSON.stringify({ a: 1 }),
      contentType: 'application/json',
      tags: [],
    });
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
  });
});
