import { parseUrl, sendError, serveFile } from 'http-lab-kit';
import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MIME_TYPES = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  png: 'image/png',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  json: 'application/json',
  xml: 'application/xml',
  mp4: 'video/mp4',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function useStaticServer(staticDirName = '../static') {
  const rootDir = path.resolve(__dirname, staticDirName);

  return function serveStatic(req, res, fileName) {
    if (req.method !== 'GET') {
      sendError(res, 'Invalid method', 405);
      return;
    }

    let relPath;
    try {
      relPath = decodeURIComponent(fileName ?? parseUrl(req).pathname);
    } catch {
      sendError(res, 'Invalid URL encoding', 400);
      return;
    }

    const ext = path.extname(relPath).slice(1).toLowerCase();

    if (!Object.hasOwn(MIME_TYPES, ext)) {
      sendError(res, 'File extension not supported', 404);
      return;
    }

    const filepath = path.resolve(rootDir, '.' + path.sep + relPath);
    if (!filepath.startsWith(rootDir + path.sep) || !fs.existsSync(filepath)) {
      sendError(res, 'File not found', 404);
      return;
    }

    serveFile(res, filepath, MIME_TYPES[ext]);
  };
}
