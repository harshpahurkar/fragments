// tests/unit/tags.test.js
const request = require('supertest');
const app = require('../../src/app');
const { clearAll } = require('../../src/model/fragments');

describe('Fragment Tagging System', () => {
  const authHeader = 'Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==';

  beforeEach(async () => {
    await clearAll();
  });

  describe('POST /v1/fragments with tags', () => {
    test('creates fragment with tags from X-Tags header', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'important, work, draft')
        .send('Tagged content');

      expect(res.statusCode).toBe(201);
      expect(res.body.fragment.tags).toEqual(['important', 'work', 'draft']);
    });

    test('creates fragment with tags from query parameter', async () => {
      const res = await request(app)
        .post('/v1/fragments?tags=personal,notes')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .send('Personal notes');

      expect(res.statusCode).toBe(201);
      expect(res.body.fragment.tags).toEqual(['personal', 'notes']);
    });

    test('creates fragment with empty tags array when no tags provided', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .send('Untagged content');

      expect(res.statusCode).toBe(201);
      expect(res.body.fragment.tags).toEqual([]);
    });

    test('handles single tag correctly', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'urgent')
        .send('Urgent task');

      expect(res.statusCode).toBe(201);
      expect(res.body.fragment.tags).toEqual(['urgent']);
    });

    test('trims whitespace from tags', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', '  spaced  , tags  ,  with  ,  whitespace  ')
        .send('Content');

      expect(res.statusCode).toBe(201);
      expect(res.body.fragment.tags).toEqual(['spaced', 'tags', 'with', 'whitespace']);
    });

    test('filters out empty tags', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'tag1,,tag2,,,tag3')
        .send('Content');

      expect(res.statusCode).toBe(201);
      expect(res.body.fragment.tags).toEqual(['tag1', 'tag2', 'tag3']);
    });
  });

  describe('GET /v1/fragments?tag=value', () => {
    test('filters fragments by single tag', async () => {
      // Create fragments with different tags
      const res1 = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'work, important')
        .send('Work doc');

      const res2 = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'personal, notes')
        .send('Personal notes');

      const res3 = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'work, project')
        .send('Project doc');

      expect(res1.statusCode).toBe(201);
      expect(res2.statusCode).toBe(201);
      expect(res3.statusCode).toBe(201);

      // Get fragments with tag 'work'
      const getRes = await request(app)
        .get('/v1/fragments?expand=1&tag=work')
        .set('Authorization', authHeader);

      expect(getRes.statusCode).toBe(200);
      expect(getRes.body.fragments).toHaveLength(2);
      expect(getRes.body.fragments.every((f) => f.tags.includes('work'))).toBe(true);
    });

    test('returns empty array when no fragments match tag', async () => {
      await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'work')
        .send('Work doc');

      const getRes = await request(app)
        .get('/v1/fragments?expand=1&tag=nonexistent')
        .set('Authorization', authHeader);

      expect(getRes.statusCode).toBe(200);
      expect(getRes.body.fragments).toEqual([]);
    });

    test('returns all fragments when no tag filter provided', async () => {
      await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'tag1')
        .send('Doc 1');

      await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'tag2')
        .send('Doc 2');

      const getRes = await request(app)
        .get('/v1/fragments?expand=1')
        .set('Authorization', authHeader);

      expect(getRes.statusCode).toBe(200);
      expect(getRes.body.fragments).toHaveLength(2);
    });

    test('tag filtering requires expand=1', async () => {
      await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'work')
        .send('Work doc');

      // Without expand, just returns IDs (can't filter)
      const getRes = await request(app)
        .get('/v1/fragments?tag=work')
        .set('Authorization', authHeader);

      expect(getRes.statusCode).toBe(200);
      expect(Array.isArray(getRes.body.fragments)).toBe(true);
      // Returns IDs, not filtered objects
    });
  });

  describe('PUT /v1/fragments/:id with tags', () => {
    test('updates fragment tags', async () => {
      // Create fragment with initial tags
      const postRes = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'draft, wip')
        .send('Initial content');

      expect(postRes.statusCode).toBe(201);
      const fragmentId = postRes.body.fragment.id;

      // Update with new tags
      const putRes = await request(app)
        .put(`/v1/fragments/${fragmentId}`)
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'final, published')
        .send('Updated content');

      expect(putRes.statusCode).toBe(200);
      expect(putRes.body.fragment.tags).toEqual(['final', 'published']);
    });

    test('preserves existing tags when not provided', async () => {
      // Create fragment with tags
      const postRes = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'important, keep')
        .send('Initial content');

      const fragmentId = postRes.body.fragment.id;

      // Update content without tags header
      const putRes = await request(app)
        .put(`/v1/fragments/${fragmentId}`)
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .send('Updated content only');

      expect(putRes.statusCode).toBe(200);
      expect(putRes.body.fragment.tags).toEqual(['important', 'keep']);
    });

    test('can clear all tags by sending empty X-Tags', async () => {
      // Create fragment with tags
      const postRes = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'remove, these')
        .send('Content');

      const fragmentId = postRes.body.fragment.id;

      // Clear tags
      const putRes = await request(app)
        .put(`/v1/fragments/${fragmentId}`)
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', '')
        .send('Content without tags');

      expect(putRes.statusCode).toBe(200);
      expect(putRes.body.fragment.tags).toEqual([]);
    });
  });

  describe('Fragment metadata includes tags', () => {
    test('GET /v1/fragments/:id/info includes tags', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/plain')
        .set('X-Tags', 'metadata, test')
        .send('Content');

      const fragmentId = postRes.body.fragment.id;

      const infoRes = await request(app)
        .get(`/v1/fragments/${fragmentId}/info`)
        .set('Authorization', authHeader);

      expect(infoRes.statusCode).toBe(200);
      expect(infoRes.body.fragment.tags).toEqual(['metadata', 'test']);
    });
  });

  describe('Tags with different content types', () => {
    test('tags work with JSON fragments', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .set('X-Tags', 'json, data')
        .send({ key: 'value' });

      expect(res.statusCode).toBe(201);
      expect(res.body.fragment.tags).toEqual(['json', 'data']);
    });

    test('tags work with markdown fragments', async () => {
      const res = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'text/markdown')
        .set('X-Tags', 'docs, markdown')
        .send('# Heading');

      expect(res.statusCode).toBe(201);
      expect(res.body.fragment.tags).toEqual(['docs', 'markdown']);
    });

    test('tags work with image fragments', async () => {
      const pngBase64 =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const pngBuffer = Buffer.from(pngBase64, 'base64');

      const res = await request(app)
        .post('/v1/fragments')
        .set('Authorization', authHeader)
        .set('Content-Type', 'image/png')
        .set('X-Tags', 'image, photo')
        .send(pngBuffer);

      expect(res.statusCode).toBe(201);
      expect(res.body.fragment.tags).toEqual(['image', 'photo']);
    });
  });
});
