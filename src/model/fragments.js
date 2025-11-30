// src/model/fragments.js
// Adapter that uses the pluggable data strategy API
const data = require('./data');
const Fragment = require('./fragment');

async function createFragment(owner, { content, contentType = 'text/plain' }) {
  const frag = new Fragment({ owner, contentType, size: Buffer.byteLength(content || '') });
  await data.writeFragment(owner, frag);
  await data.writeFragmentData(owner, frag.id, content);
  return Object.assign({}, frag, { content });
}

async function listFragments(owner, expand = false) {
  const ids = await data.listFragments(owner);
  if (!expand) return ids;
  // expand to metadata objects
  const metas = await Promise.all(
    ids.map(async (id) => {
      const m = await data.readFragment(owner, id);
      return m;
    })
  );
  return metas;
}

async function getFragmentMeta(owner, id) {
  return data.readFragment(owner, id);
}

async function getFragment(owner, id) {
  const meta = await data.readFragment(owner, id);
  if (!meta) return null;
  const dataBuf = await data.readFragmentData(owner, id);
  return Object.assign({}, meta, { content: dataBuf });
}

async function clearAll() {
  return data.clearAll();
}

async function deleteFragment(owner, id) {
  // Check metadata exists first
  const meta = await data.readFragment(owner, id);
  if (!meta) return false;
  await data.deleteFragment(owner, id);
  return true;
}

module.exports = {
  createFragment,
  listFragments,
  getFragment,
  getFragmentMeta,
  clearAll,
  deleteFragment,
};
