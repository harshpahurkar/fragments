const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
});

describe('GET /v1/fragments/:id/info 404', () => {
  test('returns 404 for missing id', async () => {
    const res = await request(app)
      .get('/v1/fragments/notfound/info')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });
});
