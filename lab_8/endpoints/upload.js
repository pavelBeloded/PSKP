import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { sendError, sendText, serveFile } from 'http-lab-kit';
import * as fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = path.join(__dirname, '../static');

export async function upload(req, res) {
  if (req.method === 'GET') {
    const pageFile = path.join(__dirname, '../pages/upload.html');
    serveFile(res, pageFile, 'text/html; charset=utf-8');
    return;
  }

  if (req.method !== 'POST') {
    sendError(res, 'Invalid method', 405);
    return;
  }

  const match = (req.headers['content-type'] ?? '').match(
    /^multipart\/form-data;\s*boundary=(?:"([^"]+)"|([^;]+))/i
  );

  if (!match) {
    sendError(res, 'Expected multipart/form-data', 400);
    return;
  }

  const delimeter = Buffer.from('--' + (match[1] ?? match[2]));

  const chunks = [];

  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);

  let pos = body.indexOf(delimeter);
  while (pos !== -1) {
    const next = body.indexOf(delimeter, pos + delimeter.length);
    if (next === -1) {
      break;
    }

    const part = body.subarray(pos + delimeter.length + 2, next - 2);
    const headerEnd = part.indexOf('\r\n\r\n');

    if (headerEnd !== -1) {
      const headers = part.subarray(0, headerEnd).toString('utf8');
      const content = part.subarray(headerEnd + 4);
      const fileName = headers.match(/filename="([^"]*)"/)?.[1];

      if (fileName) {
        const safeName = path.basename(fileName);
        await fs.writeFile(path.join(staticDir, safeName), content);
        sendText(res, `File ${safeName} saved (${content.length} bytes)`, 200);
        return;
      }
    }

    pos = next;
  }

  sendError(res, 'File not found', 400);
}
