// tests/unit/getByIdExt-image-conversions.test.js
const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

describe('GET /v1/fragments/:id.ext - image conversions', () => {
  const authHeader = 'Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==';

  beforeEach(async () => {
    await clearAll();
  });

  // Create a simple 1x1 pixel PNG image (base64 encoded)
  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const pngBuffer = Buffer.from(pngBase64, 'base64');

  test('converts PNG to JPEG', async () => {
    // Create PNG fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'image/png')
      .send(pngBuffer);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Convert to JPEG
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.jpg`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('image/jpeg');
    expect(Buffer.isBuffer(getRes.body)).toBe(true);
  });

  test('converts PNG to WebP', async () => {
    // Create PNG fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'image/png')
      .send(pngBuffer);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Convert to WebP
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.webp`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('image/webp');
  });

  test('converts PNG to GIF', async () => {
    // Create PNG fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'image/png')
      .send(pngBuffer);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Convert to GIF
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.gif`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('image/gif');
  });

  test('converts PNG to AVIF', async () => {
    // Create PNG fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'image/png')
      .send(pngBuffer);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Convert to AVIF
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.avif`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('image/avif');
  });

  test('returns PNG as-is with .png extension', async () => {
    // Create PNG fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'image/png')
      .send(pngBuffer);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Get as PNG
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.png`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('image/png');
  });

  test('converts using .jpeg extension (alternative)', async () => {
    // Create PNG fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'image/png')
      .send(pngBuffer);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Convert to JPEG using .jpeg extension
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.jpeg`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('image/jpeg');
  });

  test('returns 415 for unsupported image format conversion', async () => {
    // Create PNG fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'image/png')
      .send(pngBuffer);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Try to convert to unsupported format
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.bmp`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(415);
  });

  test('converts JPEG to PNG', async () => {
    // Create a minimal JPEG (we'll use the PNG conversion first)
    const postPng = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'image/png')
      .send(pngBuffer);
    const tempId = postPng.body.fragment.id;

    // Get it as JPEG
    const jpegRes = await request(app)
      .get(`/v1/fragments/${tempId}.jpg`)
      .set('Authorization', authHeader);
    const jpegBuffer = jpegRes.body;

    // Now create a JPEG fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'image/jpeg')
      .send(jpegBuffer);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Convert JPEG to PNG
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.png`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('image/png');
  });

  test('converts WebP to PNG', async () => {
    // Create PNG first
    const postPng = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'image/png')
      .send(pngBuffer);
    const tempId = postPng.body.fragment.id;

    // Get it as WebP
    const webpRes = await request(app)
      .get(`/v1/fragments/${tempId}.webp`)
      .set('Authorization', authHeader);
    const webpBuffer = webpRes.body;

    // Create WebP fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Authorization', authHeader)
      .set('Content-Type', 'image/webp')
      .send(webpBuffer);
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Convert WebP to PNG
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}.png`)
      .set('Authorization', authHeader);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toBe('image/png');
  });
});
