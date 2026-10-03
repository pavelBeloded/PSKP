import http from 'http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseUrl, readBody, send, sendError, serveFile } from 'http-lab-kit';
import * as querystring from 'node:querystring';
import { sendmail } from './mailer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML = 'text/html; charset=utf-8';

const sendMail = (options) =>
  new Promise((resolve, reject) => {
    sendmail(options, (err, reply) => (err ? reject(err) : resolve(reply)));
  });

const server = http.createServer(async (req, res) => {
  const url = parseUrl(req);

  if (url.pathname === '/' && req.method === 'GET') {
    try {
      serveFile(res, path.join(__dirname, 'index.html'), HTML);
    } catch (e) {
      sendError(res, e.message, 500);
    }
    return;
  }

  if (url.pathname === '/send' && req.method === 'POST') {
    try {
      const { from, to, message } = (await readBody(req, querystring.parse)) ?? {};
      if (!from || !to || !message) {
        return sendError(res, 'Заполни все поля', 400);
      }
      const reply = await sendMail({ from, to, subject: 'Lab 06', text: message });
      console.log(reply);
      serveFile(res, path.join(__dirname, 'sended.html'), HTML);
    } catch (e) {
      console.error(e);
      sendError(res, 'Ошибка отправки: ' + e.message, 500);
    }
    return;
  }

  if (url.pathname === '/sendDirectly' && req.method === 'POST') {
    try {
      const { message } = await readBody(req, JSON.parse);
      await send(message);
      serveFile(res, path.join(__dirname, 'sended.html'), HTML);
    } catch (e) {
      console.error(e);
      sendError(res, 'Ошибка отправки: ' + e.message, 500);
    }
    return;
  }

  sendError(res, 'Not found', 404);
});

server.listen(5000, () => {
  console.log('Server started on http://localhost:5000 ');
});
