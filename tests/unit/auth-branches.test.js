describe('auth branches and hash-user', () => {
  test('hash-user does nothing when req.user is falsy', () => {
    const mw = require('../../src/auth/hash-user');
    const req = {};
    const res = {};
    const next = jest.fn();
    mw.hashUser(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.ownerId).toBeUndefined();
  });

  test('basic-auth throws when HTPASSWD_FILE unset', () => {
    const OLD = process.env.HTPASSWD_FILE;
    delete process.env.HTPASSWD_FILE;
    jest.resetModules();
    expect(() => require('../../src/auth/basic-auth')).toThrow();
    if (OLD) process.env.HTPASSWD_FILE = OLD;
    else delete process.env.HTPASSWD_FILE;
  });

  test('cognito throws when env vars unset', () => {
    const oldPool = process.env.AWS_COGNITO_POOL_ID;
    const oldClient = process.env.AWS_COGNITO_CLIENT_ID;
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    jest.resetModules();
    expect(() => require('../../src/auth/cognito')).toThrow();
    if (oldPool) process.env.AWS_COGNITO_POOL_ID = oldPool;
    if (oldClient) process.env.AWS_COGNITO_CLIENT_ID = oldClient;
  });
});
