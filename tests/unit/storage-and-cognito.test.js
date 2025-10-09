const request = require('supertest');

describe('Storage failure and Cognito bearer tests', () => {
  afterEach(() => {
    // cleanup any env changes
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    delete process.env.HTPASSWD_FILE;
    jest.resetModules();
    jest.restoreAllMocks();
  });

  test('POST returns 500 when data.writeFragmentData throws', async () => {
    // require modules fresh
    const data = require('../../src/model/data');
    const fragments = require('../../src/model/fragments');
    // spy on writeFragmentData to throw
    const spy = jest.spyOn(data, 'writeFragmentData').mockImplementation(() => {
      throw new Error('simulated storage failure');
    });

    // require app after mocking not necessary; use existing app
    const app = require('../../src/app');

    // ensure clear
    await fragments.clearAll();

    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('payload');

    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe('error');
    // restore spy
    spy.mockRestore();
  });

  test('Cognito bearer auth path: can create and list a fragment with mocked verifier', async () => {
    // Mock the aws-jwt-verify module before loading app
    jest.resetModules();
    // ensure Basic auth env is not set
    delete process.env.HTPASSWD_FILE;
    process.env.AWS_COGNITO_POOL_ID = 'testpool';
    process.env.AWS_COGNITO_CLIENT_ID = 'testclient';

    jest.mock('aws-jwt-verify', () => ({
      CognitoJwtVerifier: {
        create: () => ({
          hydrate: () => Promise.resolve(),
          verify: async () => {
            // return a user-like object
            return { email: 'bearer@example.com' };
          },
        }),
      },
    }));

    // Now require the app fresh so auth/index picks up cognito
    const app = require('../../src/app');

    // POST a fragment with Bearer token
    const post = await request(app)
      .post('/v1/fragments')
      .set('Authorization', 'Bearer faketoken')
      .set('Content-Type', 'text/plain')
      .send('from bearer');

    const { hashEmail } = require('../../src/hash');
    expect(post.statusCode).toBe(201);
    expect(post.body.fragment.owner).toBe(hashEmail('bearer@example.com'));

    const list = await request(app).get('/v1/fragments').set('Authorization', 'Bearer faketoken');
    expect(list.statusCode).toBe(200);
    expect(Array.isArray(list.body.fragments)).toBe(true);
  });
});
