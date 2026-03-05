'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');

const MIME_TYPES = {
  html: 'text/html; charset=utf-8',
  css: 'text/css',
  js: 'application/javascript',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  txt: 'text/plain',
};

class Static {
  constructor(staticPath) {
    this.path = staticPath;
  }

  async serve(url, transport) {
    const { res } = transport;
    const safePath = url === '/' ? '/index.html' : url;
    const filePath = path.join(this.path, path.normalize(safePath));
    if (!filePath.startsWith(this.path)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    try {
      const data = await fsp.readFile(filePath);
      const ext = path.extname(filePath).slice(1).toLowerCase();
      const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }
}

module.exports = { Static };
