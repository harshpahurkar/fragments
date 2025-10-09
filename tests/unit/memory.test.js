const data = require('../../src/model/data');

describe('data strategy (memory)', () => {
  beforeEach(() => {
    if (data.clearAll) data.clearAll();
  });

  test('write/read fragment and data', async () => {
    const meta = await data.writeFragment('ownerA', { contentType: 'text/plain' });
    expect(meta).toHaveProperty('id');

    await data.writeFragmentData('ownerA', meta.id, 'abc');

    const m = await data.readFragment('ownerA', meta.id);
    expect(m).toBeTruthy();

    const d = await data.readFragmentData('ownerA', meta.id);
    expect(d).toBe('abc');
  });
});
