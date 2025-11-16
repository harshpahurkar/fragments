const request = require('supertest');
const app = require('../../src/app');
const { clearAll, createFragment } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
});

describe('GET /v1/fragments/:id with invalid stored JSON', () => {
  test('returns raw content when stored JSON cannot be parsed', async () => {
    const { hashEmail } = require('../../src/hash');
    const ownerId = hashEmail('user1@email.com');
    // create fragment directly via model with invalid JSON content under hashed ownerId
    const frag = await createFragment(ownerId, {
      content: '{ invalid json',
      contentType: 'application/json',
    });

    const res = await request(app)
      .get(`/v1/fragments/${frag.id}`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    // content-type is returned as text/plain when stored JSON is invalid
    expect(res.type).toBe('text/plain');
    expect(res.text).toBe('{ invalid json');
  });
});
