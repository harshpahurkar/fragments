afterEach(() => {
  jest.resetModules();
});

test('GET ext .html returns 500 when markdown-it is not available', async () => {
  // mock fragments.getFragment to return a markdown fragment
  const frag = { id: 'x1', content: '# hi', contentType: 'text/markdown' };
  jest.doMock('../../src/model/fragments', () => ({
    getFragment: jest.fn().mockResolvedValue(frag),
  }));
  // mock markdown-it to throw when required
  jest.doMock('markdown-it', () => {
    throw new Error('no markdown');
  });

  const handler = require('../../src/routes/api/getByIdExt');

  const req = { params: { id: 'x1', ext: 'html' }, ownerId: 'owner' };
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const res = { status, setHeader: jest.fn() };

  await handler(req, res);

  expect(status).toHaveBeenCalledWith(500);
  expect(json).toHaveBeenCalled();
});
