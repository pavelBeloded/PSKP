import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function files(res) {
  const staticPath = path.join(__dirname, '../static');
  const entries = await fs.readdir(staticPath, { recursive: true, withFileTypes: true });
  const count = entries.filter((entry) => entry.isFile()).length;

  res.setHeader('X-static-files-count', count);
  res.end();
}
