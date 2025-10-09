const db = require('../../src/model/data/memory/memory-db');

describe('memory-db adapter', () => {
  beforeEach(() => {
    db.clearAll();
  });

  test('writeFragment and readFragment/readFragmentData and listFragments work', async () => {
    const meta = await db.writeFragment('owner1', { contentType: 'text/plain', size: 11 });
    expect(meta).toHaveProperty('id');
    expect(meta.owner).toBe('owner1');

    await db.writeFragmentData('owner1', meta.id, 'hello world');

    const readMeta = await db.readFragment('owner1', meta.id);
    expect(readMeta).toEqual(expect.objectContaining({ id: meta.id, owner: 'owner1' }));

    const data = await db.readFragmentData('owner1', meta.id);
    expect(data).toBe('hello world');

    const list = await db.listFragments('owner1');
    expect(Array.isArray(list)).toBe(true);
    expect(list).toContain(meta.id);
  });

  test('reading missing owner/id returns null or empty', async () => {
    const meta = await db.readFragment('no-owner', 'no-id');
    expect(meta).toBeNull();

    const data = await db.readFragmentData('no-owner', 'no-id');
    expect(data).toBeNull();

    const list = await db.listFragments('no-owner');
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(0);
  });
});
