const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
});

describe('GET /v1/fragments/:id/info', () => {
  test('returns 404 for missing id', async () => {
    const res = await request(app)
      .get('/v1/fragments/notfound/info')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/123/info').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/123/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('returns metadata for existing fragment', async () => {
    // Create a fragment first
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('test fragment data');

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Get its metadata
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}/info`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.fragment).toBeDefined();
    expect(getRes.body.fragment.id).toBe(fragmentId);
    expect(getRes.body.fragment.contentType).toBe('text/plain');
    expect(getRes.body.fragment.size).toBeGreaterThan(0);
  });

  test('returns 404 when requesting another user\'s fragment info', async () => {
    // User 1 creates a fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('user1 fragment');

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // User 2 tries to get its info
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}/info`)
      .auth('user2@email.com', 'password2');

    expect(getRes.statusCode).toBe(404);
  });

  test('returns correct metadata for JSON fragment', async () => {
    const jsonData = { test: 'data', number: 123 };
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(jsonData));

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}/info`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.fragment.contentType).toBe('application/json');
    expect(getRes.body.fragment.id).toBe(fragmentId);
  });

  test('returns correct metadata for markdown fragment', async () => {
    const markdown = '# Title\n\nSome content';
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(markdown);

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}/info`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.fragment.contentType).toBe('text/markdown');
    expect(getRes.body.fragment.size).toBeGreaterThan(0);
  });
});
