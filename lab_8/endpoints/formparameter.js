import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
import { readBody, sendText, serveFile } from 'http-lab-kit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function formparameter(res, req) {
  if (req.method === 'GET') {
    serveFile(
      res,
      path.join(__dirname, '../pages/formparam.html'),
      'text/html; charset=utf-8'
    );
    return;
  }

  if (req.method === 'POST') {
    const params = await readBody(req, (raw) => new URLSearchParams(raw));

    const text = [...(params ?? [])].map(([name, value]) => `${name} = ${value}`).join('\n');

    sendText(res, text || 'no parameters', 200);
  }
}
