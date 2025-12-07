const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
});

describe('GET extension negatives', () => {
  test('unsupported extension returns 415', async () => {
    // create a fragment
    const create = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello');
    const id = create.body.fragment.id;

    // Try an invalid conversion (plain text to json)
    const res = await request(app)
      .get(`/v1/fragments/${id}.json`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });

  test('html conversion for non-markdown returns 415', async () => {
    const create = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('plain text');
    const id = create.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });
});
