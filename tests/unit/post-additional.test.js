const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

beforeEach(() => {
  clearAll();
});

describe('POST /v1/fragments - additional branch coverage', () => {
  test('handles text/html content type', async () => {
    const htmlContent = '<html><body><h1>Hello</h1></body></html>';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(htmlContent);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('text/html');
    expect(res.body.fragment.size).toBeGreaterThan(0);
  });

  test('handles text/markdown content type', async () => {
    const markdownContent = '# Title\n\nSome **bold** text';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(markdownContent);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('text/markdown');
  });

  test('handles text/csv content type', async () => {
    const csvContent = 'name,age\nJohn,30\nJane,25';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/csv')
      .send(csvContent);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('text/csv');
  });

  test('returns 415 for unsupported content type image/png', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(Buffer.from('fake png data'));

    expect(res.statusCode).toBe(415);
    expect(res.body.error.message).toContain('unsupported media type');
  });

  test('returns 415 for unsupported content type application/xml', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/xml')
      .send('<xml></xml>');

    expect(res.statusCode).toBe(415);
    expect(res.body.error.message).toContain('unsupported media type');
  });

  test('handles JSON with array payload', async () => {
    const arrayData = [1, 2, 3, 4, 5];
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(arrayData));

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('application/json');
    expect(res.body.fragment.size).toBeGreaterThan(0);
  });

  test('handles empty JSON object', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({}));

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('application/json');
  });

  test('handles deeply nested JSON', async () => {
    const nestedData = {
      level1: {
        level2: {
          level3: {
            value: 'deep'
          }
        }
      }
    };
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(nestedData));

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('application/json');
  });

  test('handles JSON with special characters', async () => {
    const specialData = { message: 'Hello "world" with \\ backslash' };
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(specialData));

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('application/json');
  });

  test('handles very long text content', async () => {
    const longText = 'a'.repeat(10000);
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(longText);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.size).toBe(10000);
  });

  test('handles empty text content', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('');

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('text/plain');
  });

  test('Location header is set correctly', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('test');

    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toBeDefined();
    expect(res.headers.location).toContain(`/v1/fragments/${res.body.fragment.id}`);
  });

  test('response includes all required fragment fields', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('test');

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment).toHaveProperty('ownerId');
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('updated');
    expect(res.body.fragment).toHaveProperty('type');
    expect(res.body.fragment).toHaveProperty('size');
  });

  test('handles content-type with charset parameter', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .send('test with charset');

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('text/plain');
  });

  test('handles JSON content-type with charset', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(JSON.stringify({ test: 'data' }));

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('application/json');
  });

  test('handles text content with unicode characters', async () => {
    const unicodeText = 'Hello 世界 🌍';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(unicodeText);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('text/plain');
  });

  test('handles markdown with unicode', async () => {
    const unicodeMarkdown = '# 中文标题\n\n**粗体**文本';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(unicodeMarkdown);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('text/markdown');
  });
});
