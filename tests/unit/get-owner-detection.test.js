describe('GET owner detection', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('uses req.ownerId when present', async () => {
    // mock model before requiring handler
    const mockList = jest.fn().mockResolvedValue(['a', 'b']);
    jest.doMock('../../src/model/fragments', () => ({ listFragments: mockList }));
    const getHandler = require('../../src/routes/api/get');

    const req = { ownerId: 'owner-hash' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getHandler(req, res);
    expect(mockList).toHaveBeenCalledWith('owner-hash');
  });

  test('falls back to req.user string when ownerId absent', async () => {
    const mockList = jest.fn().mockResolvedValue([]);
    jest.doMock('../../src/model/fragments', () => ({ listFragments: mockList }));
    const getHandler = require('../../src/routes/api/get');

    const req = { user: 'user@example.com' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getHandler(req, res);
    expect(mockList).toHaveBeenCalledWith('user@example.com');
  });
});
