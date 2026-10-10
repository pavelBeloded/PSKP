import { sendError, sendJson } from 'http-lab-kit';

export async function connection(res, url, method, server) {
  if (method === 'GET') {
    const setParam = url.searchParams.get('set');

    if (!setParam) {
      sendJson(res, { keepAliveTimeout: server.keepAliveTimeout }, 200);
      return;
    }

    const value = Number.parseInt(setParam);

    if (isNaN(value) || value < 0) {
      sendError(res, 'Invalid [set] param format', 400);
      return;
    }

    server.keepAliveTimeout = value;
    sendJson(res, { keepAliveTimeout: server.keepAliveTimeout }, 200);
    return;
  }
  sendError(res, 'Not found', 404);
}
