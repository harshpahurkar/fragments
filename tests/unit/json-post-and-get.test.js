const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
  delete process.env.API_URL;
});

describe('POST application/json and GET JSON', () => {
  test('can POST application/json and GET returns JSON content-type and body', async () => {
    const payload = { a: 1, b: 'two' };
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(payload));

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    const id = res.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.type).toBe('application/json');
    expect(getRes.body).toEqual(payload);
  });
});
