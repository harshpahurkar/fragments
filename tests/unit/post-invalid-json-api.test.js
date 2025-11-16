const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
});

describe('POST invalid JSON (buffer path)', () => {
  test('returns 400 for invalid JSON payload sent as raw buffer', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('{ invalid json');

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
  });
});
