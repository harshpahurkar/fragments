// tests/unit/getByIdExt-text-conversions.test.js
const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

describe('GET /v1/fragments/:id.ext - text format conversions', () => {
  const authHeader = 'Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==';

  beforeEach(async () => {
    await clearAll();
  });

  test('returns HTML as-is with .html extension', async () => {
    const htmlContent = '<h1>Hello</h1>';
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/html')
      .send(htmlContent);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('text/html');
    expect(getRes.text).toBe(htmlContent);
  });

  test('converts HTML to text with .txt extension', async () => {
    const htmlContent = '<h1>Hello</h1><p>World</p>';
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/html')
      .send(htmlContent);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.txt`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe(htmlContent);
  });

  test('returns markdown as-is with .md extension', async () => {
    const mdContent = '# Hello\n\nWorld';
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/markdown')
      .send(mdContent);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.md`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('text/markdown');
    expect(getRes.text).toBe(mdContent);
  });

  test('converts markdown to text with .txt extension', async () => {
    const mdContent = '# Hello\n\nWorld';
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/markdown')
      .send(mdContent);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.txt`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe(mdContent);
  });

  test('returns JSON as-is with .json extension', async () => {
    const jsonData = { key: 'value', number: 42 };
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/json')
      .send(jsonData);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.json`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('application/json');
    expect(JSON.parse(getRes.text)).toEqual(jsonData);
  });

  test('converts JSON to text with .txt extension', async () => {
    const jsonData = { key: 'value' };
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/json')
      .send(jsonData);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.txt`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toContain('key');
    expect(getRes.text).toContain('value');
  });

  test('returns CSV as-is with .csv extension', async () => {
    const csvContent = 'name,age\nJohn,30\nJane,25';
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/csv')
      .send(csvContent);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.csv`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('text/csv');
    expect(getRes.text).toBe(csvContent);
  });

  test('converts CSV to text with .txt extension', async () => {
    const csvContent = 'name,age\nJohn,30';
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/csv')
      .send(csvContent);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.txt`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe(csvContent);
  });

  test('returns YAML as-is with .yaml extension', async () => {
    const yamlContent = 'name: John\nage: 30';
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/yaml')
      .send(yamlContent);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.yaml`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('application/yaml');
    expect(getRes.text).toBe(yamlContent);
  });

  test('returns YAML as-is with .yml extension', async () => {
    const yamlContent = 'name: John\nage: 30';
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/yaml')
      .send(yamlContent);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.yml`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('application/yaml');
    expect(getRes.text).toBe(yamlContent);
  });

  test('converts YAML to text with .txt extension', async () => {
    const yamlContent = 'name: John\nage: 30';
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/yaml')
      .send(yamlContent);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.txt`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe(yamlContent);
  });

  test('handles .htm extension for HTML', async () => {
    const htmlContent = '<p>Test</p>';
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/html')
      .send(htmlContent);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.htm`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('text/html');
    expect(getRes.text).toBe(htmlContent);
  });

  test('returns 415 when trying to convert text/plain to JSON', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain')
      .send('plain text');
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.json`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(415);
  });

  test('returns 415 when trying to convert JSON to HTML', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/json')
      .send({ key: 'value' });
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(415);
  });
});
