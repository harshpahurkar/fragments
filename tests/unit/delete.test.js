const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  // Test user authentication
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/123').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .delete('/v1/fragments/123')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated user can delete their own fragment', async () => {
    // Create a fragment first
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('test fragment to delete');

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Now delete it
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(deleteRes.statusCode).toBe(204);
    expect(deleteRes.text).toBe('');

    // Verify it's deleted by trying to GET it
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(404);
  });

  test('returns 404 when trying to delete a non-existent fragment', async () => {
    const deleteRes = await request(app)
      .delete('/v1/fragments/non-existent-id')
      .auth('user1@email.com', 'password1');

    expect(deleteRes.statusCode).toBe(404);
    expect(deleteRes.body.status).toBe('error');
    expect(deleteRes.body.error.message).toBe('not found');
  });

  test("cannot delete another user's fragment", async () => {
    // User 1 creates a fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('user1 fragment');

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // User 2 tries to delete it
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user2@email.com', 'password2');

    expect(deleteRes.statusCode).toBe(404);
    expect(deleteRes.body.error.message).toBe('not found');

    // Verify user 1 can still access it
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
  });

  test('successfully deletes fragment with different content types', async () => {
    // Test with JSON fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ test: 'data' }));

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const deleteRes = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(deleteRes.statusCode).toBe(204);
  });

  test('deletes markdown fragment successfully', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# Markdown Title\nSome content');

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const deleteRes = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(deleteRes.statusCode).toBe(204);

    // Verify the markdown fragment is deleted
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(404);
  });
});
