import { parseUrl, sendError, serveFile } from 'http-lab-kit';
import * as fs from 'node:fs';
import path from 'node:path';

const MIME_TYPES = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  png: 'image/png',
  docx: 'application/msword',
  json: 'application/json',
  xml: 'application/xml',
  mp4: 'video/mp4',
};

export default function useStaticServer(staticDirName = 'static') {
  const rootDir = path.resolve(process.cwd(), staticDirName);

  return function serveStatic(req, res) {
    if (req.method !== 'GET') {
      sendError(res, 'Invalid method', 405);
      return;
    }

    const url = parseUrl(req);
    const match = url.pathname.match(/\.([^.]+)$/);
    const ext = match ? match[1] : null;

    if (!ext || !Object.hasOwn(MIME_TYPES, ext)) {
      sendError(res, 'File extension not supported', 404);
      return;
    }

    const filepath = path.join(rootDir, url.pathname);
    if (!fs.existsSync(filepath)) {
      sendError(res, 'File not found', 404);
      return;
    }

    serveFile(res, filepath, MIME_TYPES[ext]);
  };
}
