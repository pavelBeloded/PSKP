import http from 'http';
import {
  parseParams,
  parseUrl,
  sendError,
  sendJson,
  readJsonBody,
  serveFile,
} from 'http-lab-kit';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { db } from './db.js';
import { state } from './state.js';
import { initSystemCommands } from './systemCommands.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

db.on('COMMIT', (message) => {
  console.log('[COMMITED] ' + message);
  if (state.stats.active) state.stats.commit++;
});

db.on('SELECT', async (arg) => console.log('[SELECT]: ', arg));
db.on('UPDATE', async (arg) => console.log('[UPDATE]: ', arg));
db.on('INSERT', async (arg) => console.log('[INSERT]: ', arg));
db.on('DELET', async (arg) => console.log('[DELET]: ', arg));

const server = http.createServer(async (req, res) => {
  res.on('finish', () => {
    if (state.stats.active) state.stats.request++;
  });

  const url = parseUrl(req);
  try {
    if (url.pathname === '/page.js') {
      serveFile(res, path.join(__dirname, 'page.js'), 'text/javascript; charset=utf-8');
      return;
    }

    if (url.pathname === '/pageActions.js') {
      serveFile(
        res,
        path.join(__dirname, 'pageActions.js'),
        'text/javascript; charset=utf-8'
      );
      return;
    }

    if (url.pathname === '/') {
      const filepath = path.join(__dirname, 'index.html');
      serveFile(res, filepath, 'text/html');
      return;
    }

    if (url.pathname === '/api/ss' && req.method === 'GET') {
      const { start, finish, request, commit } = state.stats;
      sendJson(res, { start, finish, request, commit });
      return;
    }

    if (url.pathname === '/api/db') {
      if (req.method === 'GET') {
        const data = await db.select();
        sendJson(res, data);
        return;
      }

      if (req.method === 'POST') {
        try {
          const body_json = await readJsonBody(req);
          const newRow = await db.insert(body_json);
          sendJson(res, newRow);
        } catch (err) {
          sendError(res, err.message, 400);
        }
        return;
      }

      if (req.method === 'PUT') {
        try {
          const row = await readJsonBody(req);
          const updatedRow = await db.update(row);

          if (!updatedRow) {
            return sendError(res, `Instance not found`, 404);
          }

          sendJson(res, updatedRow);
        } catch (err) {
          sendError(res, err.message, 400);
        }
        return;
      }

      if (req.method === 'DELETE') {
        const { id } = parseParams(url, { id: 'int' });

        if (id === null) {
          return sendError(res, "Missing parameter 'id' or wrong format", 400);
        }

        const deleted = await db.delet(id);
        if (deleted === null || deleted === false) {
          return sendError(res, `Instance with id ${id} not found`, 404);
        }

        sendJson(res, deleted);
        return;
      }
    }

    sendError(res, 'Not Found', 404);
  } catch (globalError) {
    sendError(res, 'Internal Server Error', 500);
  }
});

server.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});

initSystemCommands(server);
