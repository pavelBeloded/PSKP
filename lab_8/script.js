import * as http from 'node:http';
import { parseUrl, sendError } from 'http-lab-kit';
import {
  connection,
  headers,
  parameterB,
  parameterQ,
  close,
  socket,
} from './endpoints/index.js';

const PORT = 5000;

const server = http.createServer(async (req, res) => {
  const url = parseUrl(req);
  const method = req.method;

  if (url.pathname === '/connection') {
    await connection(res, url, method, server);
    return;
  }

  if (url.pathname === '/headers') {
    await headers(res);
    return;
  }

  if (url.pathname === '/parameter') {
    parameterQ(res, url);
    return;
  }

  if (url.pathname.startsWith('/parameter/')) {
    parameterB(res, url);
    return;
  }

  if (url.pathname === '/close') {
    close(res);
    return;
  }

  if (url.pathname === '/socket') {
    socket(res, url);
    return;
  }

  if (url.pathname === '/req-data') {
  }

  sendError(res, 'Not found', 404);
});

server.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
