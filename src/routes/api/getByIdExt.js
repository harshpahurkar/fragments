// src/routes/api/getByIdExt.js
const { createErrorResponse } = require('../../response');
const { getFragment } = require('../../model/fragments');
const Fragment = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const { id, ext } = req.params;
  const owner =
    req.ownerId ||
    (req.user && (typeof req.user === 'string' ? req.user : req.user.username || req.user.email)) ||
    'anonymous';

  try {
    const fragment = await getFragment(owner, id);
    if (!fragment) return res.status(404).json(createErrorResponse(404, 'Fragment not found'));

    const contentType = fragment.contentType;
    const validConversions = Fragment.getValidConversions(contentType);

    // Check if the requested extension is valid for this content type
    if (!validConversions.includes(`.${ext}`)) {
      return res
        .status(415)
        .json(createErrorResponse(415, `Cannot convert ${contentType} to .${ext}`));
    }

    // Get fragment content as Buffer
    let content = fragment.content;
    if (!content) {
      content = Buffer.from('');
    } else if (!Buffer.isBuffer(content)) {
      content = Buffer.from(content);
    }

    // TEXT CONVERSIONS
    // Convert to plain text (.txt)
    if (ext === 'txt') {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(content.toString('utf-8'));
    }

    // Markdown to HTML (.html or .htm)
    if ((ext === 'html' || ext === 'htm') && contentType === 'text/markdown') {
      const md = require('markdown-it')();
      const html = md.render(content.toString('utf-8'));
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    }

    // HTML to HTML (no conversion needed)
    if ((ext === 'html' || ext === 'htm') && contentType === 'text/html') {
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(content);
    }

    // Markdown to Markdown (no conversion)
    if (ext === 'md' && contentType === 'text/markdown') {
      res.setHeader('Content-Type', 'text/markdown');
      return res.status(200).send(content);
    }

    // JSON to JSON or text
    if (ext === 'json' && contentType === 'application/json') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(content);
    }

    // CSV to CSV or text
    if (ext === 'csv' && contentType === 'text/csv') {
      res.setHeader('Content-Type', 'text/csv');
      return res.status(200).send(content);
    }

    // YAML conversions
    if ((ext === 'yaml' || ext === 'yml') && contentType === 'application/yaml') {
      res.setHeader('Content-Type', 'application/yaml');
      return res.status(200).send(content);
    }

    // IMAGE CONVERSIONS using sharp
    if (contentType.startsWith('image/')) {
      const sharp = require('sharp');

      let targetFormat;
      let targetContentType;

      switch (ext) {
        case 'png':
          targetFormat = 'png';
          targetContentType = 'image/png';
          break;
        case 'jpg':
        case 'jpeg':
          targetFormat = 'jpeg';
          targetContentType = 'image/jpeg';
          break;
        case 'webp':
          targetFormat = 'webp';
          targetContentType = 'image/webp';
          break;
        case 'gif':
          targetFormat = 'gif';
          targetContentType = 'image/gif';
          break;
        case 'avif':
          targetFormat = 'avif';
          targetContentType = 'image/avif';
          break;
        default:
          return res
            .status(415)
            .json(createErrorResponse(415, `Unsupported image format: .${ext}`));
      }

      // Convert the image
      const convertedImage = await sharp(content).toFormat(targetFormat).toBuffer();

      res.setHeader('Content-Type', targetContentType);
      return res.status(200).send(convertedImage);
    }

    // If we get here, conversion is not supported
    return res
      .status(415)
      .json(createErrorResponse(415, `Cannot convert ${contentType} to .${ext}`));
  } catch (err) {
    logger.error({ err, id, ext }, 'Error converting fragment');
    return res.status(500).json(createErrorResponse(500, 'Error converting fragment'));
  }
};
