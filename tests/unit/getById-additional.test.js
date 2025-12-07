const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
});

describe('GET /v1/fragments/:id - additional branch coverage', () => {
  test('returns 404 for non-existent fragment', async () => {
    const res = await request(app)
      .get('/v1/fragments/does-not-exist')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
    expect(res.body.error.message).toBe('not found');
  });

  test('returns JSON content with proper parsing when Buffer', async () => {
    const jsonData = { key: 'value', number: 42, nested: { data: true } };
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(jsonData));

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toContain('application/json');
    expect(getRes.body).toEqual(jsonData);
  });

  test('returns text/html content with proper content-type', async () => {
    const htmlData = '<html><body>Test</body></html>';
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(htmlData);

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toContain('text/html');
    expect(getRes.text).toBe(htmlData);
  });

  test('returns text/markdown content', async () => {
    const markdownData = '# Header\n\n- Item 1\n- Item 2';
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(markdownData);

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toContain('text/markdown');
    expect(getRes.text).toBe(markdownData);
  });

  test('returns text/csv content', async () => {
    const csvData = 'name,age\nJohn,30\nJane,25';
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/csv')
      .send(csvData);

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toContain('text/csv');
    expect(getRes.text).toBe(csvData);
  });

  test("cannot access another user's fragment", async () => {
    // User 1 creates a fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('private data');

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // User 2 tries to access it
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user2@email.com', 'password2');

    expect(getRes.statusCode).toBe(404);
  });

  test('handles complex JSON with nested structures', async () => {
    const complexJson = {
      users: [
        { id: 1, name: 'Alice', roles: ['admin', 'user'] },
        { id: 2, name: 'Bob', roles: ['user'] },
      ],
      meta: { version: '1.0', count: 2 },
    };

    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(complexJson));

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toContain('application/json');
    expect(getRes.body).toEqual(complexJson);
  });

  test('handles empty JSON object', async () => {
    const emptyJson = {};
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(emptyJson));

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toEqual(emptyJson);
  });

  test('handles JSON array', async () => {
    const jsonArray = [1, 2, 3, 4, 5];
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(jsonArray));

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toEqual(jsonArray);
  });
});
