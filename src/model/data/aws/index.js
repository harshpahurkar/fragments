// src/model/data/aws/index.js
const MemoryDB = require('../memory/memory-db'); // temporary metadata store until DynamoDB is added
const s3Client = require('./s3Client');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const logger = require('../../../logger');

// Writes a fragment's metadata using the existing MemoryDB
async function writeFragment(owner, fragment) {
  return MemoryDB.writeFragment(owner, fragment);
}

// Writes a fragment's data to an S3 Object in a Bucket
async function writeFragmentData(owner, id, data) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${owner}/${id}`,
    Body: data,
  };
  const command = new PutObjectCommand(params);
  try {
    await s3Client.send(command);
    // update metadata size in our temporary metadata store
    const meta = await MemoryDB.readFragment(owner, id);
    if (meta) {
      meta.size = Buffer.byteLength(data || '');
      await MemoryDB.writeFragment(owner, meta);
    }
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error uploading fragment data to S3');
    throw new Error('unable to upload fragment data');
  }
}

// Convert a stream of data into a Buffer
const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

// Reads a fragment's data from S3 and returns (Promise<Buffer>)
async function readFragmentData(owner, id) {
  const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: `${owner}/${id}` };
  const command = new GetObjectCommand(params);
  try {
    const data = await s3Client.send(command);
    return streamToBuffer(data.Body);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error streaming fragment data from S3');
    throw new Error('unable to read fragment data');
  }
}

// Deletes fragment data from S3 and metadata from MemoryDB
async function deleteFragment(owner, id) {
  const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: `${owner}/${id}` };
  const command = new DeleteObjectCommand(params);
  try {
    await s3Client.send(command);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error deleting fragment data from S3');
    throw new Error('unable to delete fragment data');
  }
  // Remove metadata from MemoryDB as well
  try {
    await MemoryDB.deleteFragment(owner, id);
  } catch (err) {
    logger.error({ err, owner, id }, 'Error deleting fragment metadata from MemoryDB');
  }
}

// Delegate reads/writes of metadata to MemoryDB until DynamoDB is implemented
async function readFragment(owner, id) {
  return MemoryDB.readFragment(owner, id);
}

async function listFragments(owner) {
  return MemoryDB.listFragments(owner);
}

async function clearAll() {
  return MemoryDB.clearAll();
}

module.exports = {
  writeFragment,
  writeFragmentData,
  readFragment,
  readFragmentData,
  listFragments,
  deleteFragment,
  clearAll,
};
