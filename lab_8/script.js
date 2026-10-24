import * as http from 'node:http';
import { parseUrl, sendError } from 'http-lab-kit';
import {
  connection,
  headers,
  parameterB,
  parameterQ,
  close,
  socket,
  resp_status,
  req_data,
  formparameter,
  json,
  xml,
  files,
  upload,
} from './endpoints/index.js';

import useStaticServer from './utils/useStaticServer.js';

const PORT = 5000;
const serveStatic = useStaticServer(process.argv[2]);

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

  if (url.pathname === '/req-data' && method === 'POST') {
    req_data(req, res);
    return;
  }

  if (url.pathname === '/resp-status') {
    resp_status(res, url);
    return;
  }

  if (url.pathname === '/formparameter') {
    await formparameter(res, req);
    return;
  }

  if (url.pathname === '/json') {
    await json(req, res);
    return;
  }

  if (url.pathname === '/xml') {
    await xml(req, res);
    return;
  }

  if (url.pathname === '/files') {
    await files(res);
    return;
  }

  if (url.pathname.startsWith('/files/')) {
    serveStatic(req, res, url.pathname.slice('/files/'.length));
    return;
  }

  if (url.pathname === '/upload') {
    await upload(req, res);
    return;
  }

  sendError(res, 'Not found', 404);
});

server.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
