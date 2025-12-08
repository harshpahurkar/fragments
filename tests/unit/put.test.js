// tests/unit/put.test.js
const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

describe('PUT /v1/fragments/:id', () => {
  const authHeader = 'Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==';

  beforeEach(async () => {
    await clearAll();
  });

  test('unauthenticated requests are denied', async () => {
    const res = await request(app).put('/v1/fragments/test-id').send('data');
    expect(res.statusCode).toBe(401);
  });

  test('incorrect credentials are denied', async () => {
    const res = await request(app)
      .put('/v1/fragments/test-id')
      .auth('invalid@email.com', 'incorrect_password')
      .send('data');
    expect(res.statusCode).toBe(401);
  });

  test('returns 404 when fragment does not exist', async () => {
    const res = await request(app)
      .put('/v1/fragments/non-existent-id')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain')
      .send('updated content');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.message).toBe('Fragment not found');
  });

  test('successfully updates an existing fragment', async () => {
    // First create a fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain')
      .send('original content');
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Update the fragment
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain')
      .send('updated content');

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.status).toBe('ok');
    expect(putRes.body.fragment.id).toBe(fragmentId);
    expect(putRes.body.fragment.size).toBe(Buffer.byteLength('updated content'));

    // Verify the content was updated
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .set('Authorization', authHeader);
    expect(getRes.text).toBe('updated content');
  });

  test('returns 400 when content-type does not match', async () => {
    // Create a text/plain fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain')
      .send('original content');
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Try to update with different content-type
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/markdown')
      .send('# Updated content');

    expect(putRes.statusCode).toBe(400);
    expect(putRes.body.error.message).toContain('Content-Type mismatch');
  });

  test('updates JSON fragment successfully', async () => {
    const originalData = { name: 'John', age: 30 };
    const updatedData = { name: 'Jane', age: 25 };

    // Create JSON fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/json')
      .send(originalData);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Update with new JSON
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/json')
      .send(updatedData);

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.fragment.type).toBe('application/json');

    // Verify updated content
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .set('Authorization', authHeader);
    expect(JSON.parse(getRes.text)).toEqual(updatedData);
  });

  test('updates markdown fragment successfully', async () => {
    // Create markdown fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/markdown')
      .send('# Original');
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Update markdown
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/markdown')
      .send('# Updated Title\n\nNew content');

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.fragment.type).toBe('text/markdown');
  });

  test('cannot update another users fragment', async () => {
    const user1Auth = 'Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==';
    const user2Auth = 'Basic dXNlcjJAZW1haWwuY29tOnBhc3N3b3JkMg==';

    // User 1 creates a fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', user1Auth)
      .set('Content-Type', 'text/plain')
      .send('user1 content');
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // User 2 tries to update it
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Authorization', user2Auth)
      .set('Content-Type', 'text/plain')
      .send('hacked content');

    expect(putRes.statusCode).toBe(404);
    expect(putRes.body.error.message).toBe('Fragment not found');
  });

  test('handles buffer body correctly', async () => {
    // Create fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain')
      .send(Buffer.from('original'));
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Update with buffer
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain')
      .send(Buffer.from('updated'));

    expect(putRes.statusCode).toBe(200);
  });

  test('handles string body correctly', async () => {
    // Create fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain')
      .send('original');
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Update with string
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain')
      .send('updated string');

    expect(putRes.statusCode).toBe(200);
  });

  test('updates fragment metadata fields correctly', async () => {
    // Create fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain')
      .send('original');
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;
    const originalCreated = postRes.body.fragment.created;

    // Wait a tiny bit to ensure updated timestamp is different
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Update the fragment
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain')
      .send('updated content with more text');

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.fragment.id).toBe(fragmentId);
    expect(putRes.body.fragment.created).toBe(originalCreated);
    expect(putRes.body.fragment.updated).toBeDefined();
    expect(putRes.body.fragment.size).toBe(Buffer.byteLength('updated content with more text'));
  });

  test('updates HTML fragment successfully', async () => {
    // Create HTML fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/html')
      .send('<h1>Original</h1>');
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Update HTML
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/html')
      .send('<h1>Updated</h1><p>New paragraph</p>');

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.fragment.type).toBe('text/html');
  });

  test('updates CSV fragment successfully', async () => {
    // Create CSV fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/csv')
      .send('name,age\nJohn,30');
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Update CSV
    const putRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/csv')
      .send('name,age\nJane,25\nBob,35');

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.fragment.type).toBe('text/csv');
  });
});
