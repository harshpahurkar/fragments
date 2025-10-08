// tests/unit/fragments-crud.test.js

const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
});

describe('Fragments CRUD', () => {
  test('POST /v1/fragments creates a fragment (text/plain)', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello world');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment).toHaveProperty('owner');
  });

  test('GET /v1/fragments returns list of fragment ids', async () => {
    // create two fragments
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('first');
    // POST1 status logged previously for debug; removed

    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('second');
    // POST2 status logged previously for debug; removed

    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    // GET list status logged previously for debug; removed
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(2);
  });

  test('GET /v1/fragments/:id returns the fragment content', async () => {
    const post = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('content for id test');

    const id = post.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    // because content-type is text/plain, we expect raw body
    expect(res.text).toBe('content for id test');
  });
});
