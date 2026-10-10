import { sendJson } from 'http-lab-kit';

export async function headers(res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-custom', 'some-value');

  const response = { req: req.headers, res: res.getHeaders() };
  sendJson(res, response, 200);
}
