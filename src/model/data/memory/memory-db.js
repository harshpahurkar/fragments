// src/model/data/memory/memory-db.js
const { randomUUID } = require('crypto');
const logger = require('../../../logger');

// In-memory stores
const metaStore = new Map(); // owner -> Map(id -> meta)
const dataStore = new Map(); // owner -> Map(id -> data)

function _ensureOwner(owner) {
  if (!metaStore.has(owner)) metaStore.set(owner, new Map());
  if (!dataStore.has(owner)) dataStore.set(owner, new Map());
}

async function writeFragment(owner, fragment) {
  _ensureOwner(owner);
  const id = fragment.id || randomUUID();
  const created = fragment.created || new Date().toISOString();
  const meta = {
    id,
    owner, // owner is the ownerId (hashed email)
    contentType: fragment.contentType || 'text/plain',
    created,
    size: fragment.size || 0,
  };
  metaStore.get(owner).set(id, meta);
  logger.debug({ owner, id }, 'memory-db: wrote fragment meta');
  return meta;
}

async function writeFragmentData(owner, id, data) {
  _ensureOwner(owner);
  dataStore.get(owner).set(id, data);
  const meta = metaStore.get(owner).get(id);
  if (meta) meta.size = Buffer.byteLength(data || '');
  logger.debug({ owner, id }, 'memory-db: wrote fragment data');
}

async function readFragment(owner, id) {
  const ownerMap = metaStore.get(owner);
  if (!ownerMap) return null;
  return ownerMap.get(id) || null;
}

async function readFragmentData(owner, id) {
  const ownerMap = dataStore.get(owner);
  if (!ownerMap) return null;
  return ownerMap.get(id) || null;
}

async function listFragments(owner) {
  const ownerMap = metaStore.get(owner);
  if (!ownerMap) return [];
  return Array.from(ownerMap.keys());
}

function clearAll() {
  metaStore.clear();
  dataStore.clear();
}

module.exports = {
  writeFragment,
  writeFragmentData,
  readFragment,
  readFragmentData,
  listFragments,
  clearAll,
};
