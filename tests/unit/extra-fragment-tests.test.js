const request = require('supertest');
const app = require('../../src/app');
const { clearAll, getFragment } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
  delete process.env.API_URL;
});

describe('Extra fragment tests: owner scoping, Location fallback, metadata size', () => {
  test('owner scoping: user A cannot see user B fragments', async () => {
    // create fragment as user1
    const post = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('secret for user1');

    expect(post.statusCode).toBe(201);
    const id = post.body.fragment.id;

    // user2 should not see it in list
    const list = await request(app).get('/v1/fragments').auth('user2@email.com', 'password2');
    expect(list.statusCode).toBe(200);
    expect(Array.isArray(list.body.fragments)).toBe(true);
    expect(list.body.fragments).not.toContain(id);

    // user2 should get 404 when trying to fetch by id
    const getById = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user2@email.com', 'password2');
    expect(getById.statusCode).toBe(404);
  });

  test('Location header falls back to request host when API_URL is unset', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .set('Host', 'example.local')
      .send('hello');

    expect(res.statusCode).toBe(201);
    expect(res.headers).toHaveProperty('location');
    expect(res.headers.location).toMatch(/^http:\/\/example.local\/v1\/fragments\//);
  });

  test('metadata size reflects written data length', async () => {
    const payload = '1234567890';
    const post = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(payload);

    expect(post.statusCode).toBe(201);
    const id = post.body.fragment.id;

    // Fetch metadata using model readFragment (internal api)
    const { hashEmail } = require('../../src/hash');
    const ownerId = hashEmail('user1@email.com');
    const meta = await getFragment(ownerId, id);
    expect(meta).toBeTruthy();
    expect(meta.size).toBe(Buffer.byteLength(payload));
  });
});
