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
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ hello: 'world' }));

    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });
});
