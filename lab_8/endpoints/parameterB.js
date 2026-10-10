import { sendError, sendJson } from 'http-lab-kit';
import { xyParams } from '../utils/xyParams.js';

export function parameterB(res, url) {
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length < 3) {
    return sendError(res, 'Two parameters are required', 400);
  }

  const x = segments[1];
  const y = segments[2];

  const result = xyParams(x, y);
  if (result.ok === false) {
    sendError(res, result.error, 400);
    return;
  }

  sendJson(res, result.data, 200);
}
