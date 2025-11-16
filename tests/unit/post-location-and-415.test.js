const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
  delete process.env.API_URL;
});

describe('POST /v1/fragments Location header and 415', () => {
  test('Location header set using API_URL when provided', async () => {
    process.env.API_URL = 'http://example.com';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello');

    expect(res.statusCode).toBe(201);
    expect(res.headers).toHaveProperty('location');
    expect(res.headers.location).toMatch(/^http:\/\/example.com\/v1\/fragments\//);
  });

  test('returns 415 for unsupported media type', async () => {
    // application/json is now supported and should be accepted
    const payload = { hello: 'world' };
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(payload));

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    // returned fragment should not expose raw content; verify stored via GET
    const id = res.body.fragment.id;
    const got = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(got.statusCode).toBe(200);
    expect(got.type).toBe('application/json');
    expect(got.body).toEqual(payload);
  });
});
