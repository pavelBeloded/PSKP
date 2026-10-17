import { sendError } from 'http-lab-kit';

export function resp_status(res, url) {
  const code = url.searchParams.get('code');
  const mess = url.searchParams.get('mess');

  if (!mess || !code) {
    sendError(res, 'Two parameters [code, mess] are required', 400);
    return;
  }

  res.writeHead(code, mess);
  res.end();
}
