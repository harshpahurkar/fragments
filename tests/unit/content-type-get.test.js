const request = require('supertest');
const app = require('../../src/app');

test('GET /v1/fragments/:id returns Content-Type header for text/plain', async () => {
  // create a fragment
  const post = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set('Content-Type', 'text/plain')
    .send('hello');

  expect(post.statusCode).toBe(201);
  const id = post.body.fragment.id;

  const res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
  expect(res.statusCode).toBe(200);
  expect(res.headers['content-type']).toMatch(/text\/plain/);
});
