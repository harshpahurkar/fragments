const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
});

describe('GET /v1/fragments/:id.ext - extension conversion', () => {
  test('converts markdown to HTML successfully', async () => {
    const markdownData = '# Title\n\nParagraph with **bold** text.';
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(markdownData);

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toContain('text/html');
    expect(getRes.text).toContain('<h1>Title</h1>');
    expect(getRes.text).toContain('<strong>bold</strong>');
  });

  test('returns 415 when trying to convert non-markdown to HTML', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('plain text');

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(415);
    expect(getRes.body.error.message).toContain('Cannot convert');
  });

  test('returns 400 for unsupported extension', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('test data');

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.pdf`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(415);
    expect(getRes.body.error.message).toContain('Cannot convert');
  });

  test('returns 404 for non-existent fragment with extension', async () => {
    const getRes = await request(app)
      .get('/v1/fragments/does-not-exist.html')
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(404);
    expect(getRes.body.error.message).toContain('not found');
  });

  test('converts markdown with lists to HTML', async () => {
    const markdownData = '# Shopping List\n\n- Item 1\n- Item 2\n- Item 3';
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(markdownData);

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toContain('text/html');
    expect(getRes.text).toContain('<ul>');
    expect(getRes.text).toContain('<li>Item 1</li>');
  });

  test('converts markdown with code blocks to HTML', async () => {
    const markdownData = '# Code Example\n\n```javascript\nconst x = 42;\n```';
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(markdownData);

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toContain('text/html');
    // markdown-it may use <code> or <pre><code> depending on the content
    expect(getRes.text).toMatch(/<code/);
  });

  test('returns 415 when trying to convert JSON to HTML', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ test: 'data' }));

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(415);
  });

  test('converts empty markdown to HTML', async () => {
    const markdownData = '';
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(markdownData);

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toContain('text/html');
  });

  test('handles markdown with links', async () => {
    const markdownData = '[Link Text](https://example.com)';
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(markdownData);

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toContain('<a href="https://example.com">');
  });

  test('returns 415 for unknown extension like .xml', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.xml`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(415);
  });

  test('returns 200 for extension .txt from text/plain', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.txt`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe('data');
  });
});
